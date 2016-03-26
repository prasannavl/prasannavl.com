import * as fs from "fs-extra-promise";
import path from "path";
import bluebird from "bluebird";
import yaml from "js-yaml";
import marked from "marked";
import chalk from "chalk";
import * as _ from "lodash";

class BuildHelper {
	static processAllAsync(inputDirPath, outputDirPath, options) {
		if (!fs.existsSync(inputDirPath)) return Promise.resolve();
		
		return BuildHelper.walkFsAsync(inputDirPath, (f, tasks) => {
			if (!f.stats.isDirectory() && f.path.match(/\.md$/i)) {
				let filePath = f.path;
				let p = BuildHelper.processAsync(filePath, outputDirPath, options);
				tasks.add(p);
			}
		});
	}

	static processAsync(inputFile, outputDir, options) {
		// TODO: forced/non-forced implementation: only write if fs timestamps are outdated. 	

		if (!fs.existsSync(inputFile)) return Promise.resolve();
		
		const { mode, force } = options;
		const isBuildMode = mode === ConfigMode.Build;

		let fileBasePath = path.basename(inputFile);
		console.log(`processing ${fileBasePath}..`);
		let configFactory = isBuildMode ? BuildHelper.createBuildConfig : BuildHelper.createPublishConfig;

		return fs.readFileAsync(inputFile, "utf-8")
			.then(data => {
				let basename = path.basename(inputFile, path.extname(inputFile));
				let config = configFactory(basename, data);
				return config;
			}).then(config => {
				let finalizerAsync = isBuildMode ? BuildHelper.finalizeBuildAsync : BuildHelper.finalizePublishAsync;
				return finalizerAsync(config, inputFile, outputDir);
			});
	}

	static walkFsAsync(inputDirPath, action, onEndAction) {
		let tasks = new RefCount(1);
		fs.walk(inputDirPath)
			.on("data", f => {
				action(f, tasks);
			})
			.on("end", (files) => {
				onEndAction && onEndAction(files, tasks);
				tasks.removeRef();
			});
		return tasks.done;
	}

	static finalizeBuildAsync(config, inputFilePath, outputDirPath) {
		let extName = ".json";
		let destPath = path.join(outputDirPath, config.url + extName);
		let data = JSON.stringify(config);

		return fs.ensureDirAsync(path.dirname(destPath))
			.then(() => BuildHelper.writeFileAsync(path.basename(inputFilePath), destPath, data));
	}

	static finalizePublishAsync(config, inputFilePath, outputDirPath) {
		let extName = ".md";
		let urlPath = config.url;
		let urlDirPath = path.join(outputDirPath, path.dirname(urlPath));
		let destPath = path.join(outputDirPath, urlPath + extName);
		let data = config.content;

		return fs.ensureDirAsync(urlDirPath)
			.then(() => BuildHelper.writeFileAsync(path.basename(inputFilePath), destPath, data))
			.then(() => fs.removeAsync(inputFilePath));
	}

	static writeFileAsync(inFilePath, destPath, data) {
		return fs.writeFileAsync(destPath, data, { flag: "w+", encoding: "utf-8" })
			.then(() => console.log(`${inFilePath} => ${destPath}`))
			.catch(err => console.log(`${inFilePath} => ${err}`));
	}

	static createBuildConfig(name, data) {
		let config = Config.createBuildConfigFrom(Config.parseFromMarkdownString(data));
		let markdownContent = Config.createBuildContent(config, data);
		return Object.assign(config, { content: markdownContent });
	}

	static createPublishConfig(name, data) {
		let contents = data;
		let mTokens = marked.lexer(data);
		let config = Config.parseFromMarkdownTokens(mTokens);

		// setup config
		if (!config.date) config.date = new Date(Date.now());

		// extract heading
		if (!config.name) {
			const headingItem = mTokens.find(x => x.type === "heading");
			const heading = headingItem ? headingItem.text : name;
			config.name = heading;
		}

		// if url is present use it directly
		// or, if slug is present, use it to generate url, 
		// or create slug first with heading.
		// always ensure there are no two clashing slugs.
		// Handled: url, slug 
		if (!config.url) {
			let slug = config.slug;
			if (!slug) slug = config.name;
			slug = sanitizeSlug(slug);
			// extract date into path
			// form url yyyy/mm/slug
			let date = config.date;
			let dateUrl = `${date.getYear()}/${date.getMonth()}/${config.slug}`;
			config.url = dateUrl;
		} else {
			let url = config.url;
			if (url.startsWith("/")) {
				config.url = url.slice(1);
			}
		}

		let configText = Config.createYamlMarkdownCommentFrom(Config.createPublishConfigFrom(config));
		let replace = true;
		let markdownContent = data.replace(new RegExp(Config.OptionsRegExpPattern, "gm"), (match) => {
			if (replace) {
				replace = false;
				return configText;
			}
			return "";
		});

		return Object.assign(config, { content: markdownContent });
	}

	static buildIndexesAsync(contentDirPath, indexDirPath, indexers) {
		const collectFileDataItems = (contentDirPath) => {
			let fileDataItems = [];
			const collector = BuildHelper.walkFsAsync(contentDirPath, (f, tasks) => {
				if (!f.stats.isDirectory() &&! f.path.startsWith(indexDirPath)) {
					let filePath = f.path;
					let p = fs.readFileAsync(filePath, "utf-8")
						.then(data => fileDataItems.push(JSON.parse(data)));
					tasks.add(p);
				}
			});
			return collector.then(() => fileDataItems);
		}

		const finalizeIndex = (indexDirPath, indexDescriptors) => {
			let p = indexDescriptors.map(x => {
				let filePath = path.join(indexDirPath, x.name + ".json");
				let data = JSON.stringify(x.data);
				return fs.ensureDirAsync(indexDirPath)
					.then(() =>
						fs.writeFileAsync(filePath, data, { flag: "w+", encoding: "utf-8" }));
			});
			return bluebird.all(p);
		}

		return collectFileDataItems(contentDirPath)
			.then((fileDataItems) =>
				_.chain(indexers)
					.map(indexer => indexer(fileDataItems))
					.flatten()
					.value())
			.then((desc) => finalizeIndex(indexDirPath, desc));
	}
}

function sanitizeSlug(slug) {
	let charsAsDash = [" ", "/", "&", "*", "\\", ";", ",", ":", "+", "%", "#", "(", , "[", "=", "{", "<", "@"];
	let removeChars = ["!", "@", "\"", "'", "?", ")", "]", "}", ">"];
	let len = charsAsDash.length;
	while (--len >= 0) {
		slug.replace(charsAsDash[len], "-");
	}
	len = removeChars.length;
	while (--len >= 0) {
		slug.replace(removeChars[len], "");
	}
}

const ConfigMode = {
	Build: 0,
	Publish: 1,
}

class Config {

	// WARNING: Exceptional pattern.
	// Set as undefined instead of null to make sure they
	// are skipped during the JSON process, and simply the
	// process instead of a replacer.
	constructor() {
		this.name = undefined;
		this.date = undefined;
		this.title = undefined;
		this.url = undefined;
		this.tags = [];

		this.slug = undefined;
		this.publish = undefined;

		this.content = undefined;
	}

	static createPublishConfigFrom(config) {
		const o = Object.assign({}, config);
		o.slug = o.publish = o.content = undefined;
		return o;
	}

	static createBuildConfigFrom(config) {
		const o = Object.assign({}, Config.createPublishConfigFrom(config));
		return o;
	}

	static parseFromMarkdownTokens(tokens, matchIndicesArray = []) {
		// Note: Currently only a single options match is detected.
		let config = new Config();
		let regex = new RegExp(Config.OptionsRegExpPattern);
		tokens
			.filter((node, i) => node.type === "html" && regex.test(node.text) && matchIndicesArray.push(i))
			.map(node => regex.exec(node.text)[1])
			.map(x => yaml.safeLoad(x))
			.forEach(x => Object.assign(config, x));
		return config;
	}

	static parseFromMarkdownString(mdString) {
		// Note: Currently only a single options match is detected.	
		let config = new Config();
		let regex = new RegExp(Config.OptionsRegExpPattern, "gm");
		let match = regex.exec(mdString);
		if (!match) return config;
		let optString = match[1];
		let yamlOpts = yaml.safeLoad(optString);
		return Object.assign(config, yamlOpts);
	}

	static createYamlMarkdownCommentFrom(config) {
		const yamlString = yaml.safeDump(config, { skipInvalid: true });
		const configText = "<!--[options]\n" + yamlString + "-->";
		return configText;
	}

	static createBuildContent(config, contentString) {
		let content = contentString.replace(new RegExp(Config.OptionsRegExpPattern, "gm"), "");
		content = content.replace(new RegExp(`^\\s*#\\s+${config.name}`), "");
		content = content.replace(/^[\s\n\r]*/, "");
		return content;
	}
}

Config.OptionsRegExpPattern = /^<!--\[options\]\s*\n([\s\S]*)?\n\s*-->/.source;

class RefCount {
	constructor(startRefNumber) {
		this._resolve = null;
		this._promise = new Promise(resolve => this._resolve = resolve);
		this._current = startRefNumber || 0;
	}

	addRef() {
		this._current++;
	}

	removeRef() {
		this._current--;
		if (this._current === 0) {
			this._resolve && this._resolve();
		}
	}

	add(promise) {
		this.addRef();
		promise.then(() => this.removeRef());
	}

	get current() {
		return this._current;
	}

	get done() {
		return this._promise;
	}
}

class Commands {
	static buildAll(srcDir, destDir, force = false) {
		console.log(chalk.cyan("Building all published content.."));
		return BuildHelper.processAllAsync(srcDir, destDir, { mode: ConfigMode.Build, force })
	}

	static build(src, destDir, force = false) {
		console.log(chalk.cyan(`Building ${src}..`));
		return BuildHelper.processAsync(src, destDir, { mode: ConfigMode.Build, force })
	}

	static publish(src, destDir, force = false) {
		console.log(chalk.cyan(`Publishing ${src}..`));
		return BuildHelper.processAsync(src, destDir, { mode: ConfigMode.Publish, force })
	}

	static publishAll(srcDir, destDir, force = false) {
		console.log(chalk.cyan("Publishing all content.."));
		return BuildHelper.processAllAsync(srcDir, destDir, { mode: ConfigMode.Publish, force });
	}

	static buildIndexes(srcDir, destDir, indexers) {
		console.log(chalk.cyan("Building indexes.."));
		return BuildHelper.buildIndexesAsync(srcDir, destDir, indexers);
	}
}

function getIndexers() {
	const overviewIndexer = (fileDataItems) => {
		console.log("overview..");

		let indexData = _.chain(fileDataItems)
			.sortBy(x => new Date(x.date))
			.reverse()
			.take(10)
			.map(x => {
				if (x.content.length > 700) {
					return Object.assign({}, x, { content: x.content.slice(0, 700) });
				};
				return x;
			})
			.value();		
		
		return { data: indexData, name: "overview" };
	};

	const archivesIndexer = (fileDataItems) => {
		console.log("archives..");

		let indexData = _.chain(fileDataItems)
			.sortBy(x => new Date(x.date))
			.map(x => _.omit(x, "content"))
			.groupBy(x => new Date(x.date).getFullYear())
			.value();
		
		return { data: indexData, name: "archives" };
	};

	const allIndexer = (fileDataItems) => {
		console.log("all..");

		let indexData = _.chain(fileDataItems)
			.sortBy(x => new Date(x.date))
			.reverse()
			.value();
		
		return { data: indexData, name: "all" };
	};
	
	let indexers = [overviewIndexer, archivesIndexer, allIndexer];
	return indexers;
}

function run() {
	const publishedDir = path.join(__dirname, "./published");
	const contentDir = path.join(__dirname, "../static/content");
	const draftsDir = path.join(__dirname, "./drafts");
	const indexDir = path.join(__dirname, "../static/content/indexes");

	console.log(chalk.green("ContentManager: starting"));	
	Commands.publishAll(draftsDir, publishedDir)
		.then(() => Commands.buildAll(publishedDir, contentDir))
		.then(() => Commands.buildIndexes(contentDir, indexDir, getIndexers()))
		.then(() => console.log(chalk.green("ContentManager: done")));
}

run();