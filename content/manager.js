import * as fs from "fs-extra-promise";
import path from "path";
import bluebird from "bluebird";
import yaml from "js-yaml";
import marked from "marked";
import chalk from "chalk";
import * as _ from "lodash";
import * as os from "os";
import configConstantsFactory from "../configConstants";

class BuildHelper {
	static processAllAsync(inputDirPath, outputDirPath, options) {
		if (!fs.existsSync(inputDirPath)) return Promise.reject(`Not found: ${inputDirPath}`);
		
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

		if (!fs.existsSync(inputFile)) return Promise.reject(`Not found: ${inputFile}`);
		
		const { mode, verbose } = options;
		const isBuildMode = mode === ConfigMode.Build;
		
		if (verbose) {
			let fileBasePath = path.basename(inputFile);
			console.log(`processing ${fileBasePath}..`);
		}

		let configFactory = isBuildMode ? BuildHelper.createBuildConfig : BuildHelper.createPublishConfig;

		return fs.readFileAsync(inputFile, "utf-8")
			.then(data => {
				let basename = path.basename(inputFile, path.extname(inputFile));
				let config = configFactory(basename, data);
				return config;
			}).then(config => {
				let finalizer = isBuildMode ? BuildHelper.finalizeBuildAsync : BuildHelper.finalizePublishAsync;
				return finalizer(config, inputFile, outputDir, options);
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

	static finalizeBuildAsync(config, inputFilePath, outputDirPath, options) {
		let { forceBuild, verbose } = options;
		let extName = ".json";
		let destPath = path.join(outputDirPath, config.url + extName);
		let shouldBuild = forceBuild ? Promise.resolve(true) : fs.existsAsync(destPath)
			.then(exists => {
				if (exists) {
					let destStatPromise = fs.statAsync(destPath);
					let srcStatPromise = fs.statAsync(inputFilePath);
					return Promise.all([destStatPromise, srcStatPromise])
						.then(res => {
							let destChangeTime = res[0].mtime;
							let srcChangeTime = res[1].mtime;
							return srcChangeTime > destChangeTime;
						});
				}
				return true;
			}).catch(() => true);

		return shouldBuild
			.then(res => {
				if (res) {
					let data = JSON.stringify(config);
					return fs.ensureDirAsync(path.dirname(destPath))
						.then(() => BuildHelper.writeFileAsync(path.basename(inputFilePath), destPath, data));
				} else {
					if (verbose) {
						console.log(chalk.red(`skipped ${path.basename(inputFilePath)}`));
					}
					return Promise.resolve();
				}
			});
	}
	
	static finalizePublishAsync(config, inputFilePath, outputDirPath, options) {
		let extName = ".md";
		let urlPath = config.url;
		let urlDirPath = path.join(outputDirPath, path.dirname(urlPath));
		let destPath = path.join(outputDirPath, urlPath + extName);
		let data = config.content;

		return fs.ensureDirAsync(urlDirPath)
			.then(() => BuildHelper.writeFileAsync(path.basename(inputFilePath), destPath, data))
			.then(() => fs.removeAsync(inputFilePath));
	}

	static writeFileAsync(inFileNotificationName, destPath, data) {
		return fs.writeFileAsync(destPath, data, { flag: "w+", encoding: "utf-8" })
			.then(() => console.log(`${inFileNotificationName} => ${destPath}`))
			.catch(err => console.log(`${inFileNotificationName} => ${err}`));
	}

	static createBuildConfig(name, data) {
		let config = Config.createBuildConfigFrom(Config.parseFromMarkdownString(data));
		let markdownContent = Config.createBuildContent(config, data);
		return Object.assign(config, { content: markdownContent });
	}

	static createPublishConfig(name, data) {
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
			let monthStr = date.getMonth().toString();
			if (monthStr.length === 1) {
				monthStr = "0" + monthStr;
			}
			let dateUrl = `${date.getFullYear()}/${monthStr}/${slug}`;
			config.url = dateUrl;
		} else {
			let url = config.url;
			if (url.startsWith("/")) {
				config.url = url.slice(1);
			}
		}

		let configText = Config.createYamlMarkdownCommentFrom(Config.createPublishConfigFrom(config));
		let optsCommentAdded = false;
		let markdownContent = data.replace(new RegExp(Config.OptionsRegExpPattern, "gm"), (match) => {
			if (!optsCommentAdded) {
				optsCommentAdded = true;
				return configText;
			}
			return "";
		});
		if (!optsCommentAdded) {
			markdownContent = configText + os.EOL + os.EOL + markdownContent;
		}
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
	let res = "";
	const charsAsDash = ["-", " ", "/", "&", "*", "\\", ";", ",", ":", "+", "%", "#", "(", "[", "=", "{", "<", "@"];
	const removeChars = ["!", "@", "\"", "'", "?", ")", "]", "}", ">"];
	let len = slug.length;
	let lastCharIsDash = false;
	for (let i = 0; i < len; i++) {
		let supressDash = false;
		if (lastCharIsDash) {
			supressDash = true;
			lastCharIsDash = false;
		}
		let c = slug[i];
		if (charsAsDash.findIndex(x => x === c) > -1) {
			if (!supressDash) res += "-";
			lastCharIsDash = true;
		}
		else if (removeChars.findIndex(x => x === c) > -1) {
			// Do nothing
		} else {
			res += c;
		}
	}
	return res.toLowerCase();
}

const ConfigMode = {
	Build: 0,
	Publish: 1,
}

class Config {

	// WARNING: Exceptional pattern.
	// Set as undefined instead of null to make sure they
	// are skipped during the JSON processing.
	constructor() {
		this.name = undefined;
		this.date = undefined;
		this.title = undefined;
		this.url = undefined;
		this.tags = [];

		this.slug = undefined;
		this.content = undefined;
	}

	static createPublishConfigFrom(config) {
		const o = Object.assign({}, config);
		o.slug = o.content = undefined;
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
		// Clear options from build
		let content = contentString.replace(new RegExp(Config.OptionsRegExpPattern, "gm"), "");
		// Remove the heading if present. Its handled by name.
		content = content.replace(new RegExp(`^\\s*#\\s+${config.name}`), "");
		// Remove any blank lines in the beginning.
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
	static buildAll(srcDir, destDir, forceBuild = false) {
		console.log(chalk.cyan("Building all published content.."));
		return BuildHelper.processAllAsync(srcDir, destDir, { mode: ConfigMode.Build, forceBuild })
	}

	static build(src, destDir, forceBuild = false) {
		console.log(chalk.cyan(`Building ${src}..`));
		return BuildHelper.processAsync(src, destDir, { mode: ConfigMode.Build, forceBuild })
	}

	static publish(src, destDir) {
		console.log(chalk.cyan(`Publishing ${src}..`));
		return BuildHelper.processAsync(src, destDir, { mode: ConfigMode.Publish })
	}

	static publishAll(srcDir, destDir) {
		console.log(chalk.cyan("Publishing all content.."));
		return BuildHelper.processAllAsync(srcDir, destDir, { mode: ConfigMode.Publish });
	}

	static buildIndexes(srcDir, destDir, indexers) {
		console.log(chalk.cyan("Building indexes.."));
		return BuildHelper.buildIndexesAsync(srcDir, destDir, indexers);
	}
}

function stripStaticPattern(content, pattern) {
	let regex = new RegExp(pattern, "g");
	let match = regex.exec(content);
	let open = 0;
	let openToggle = true;
	while (match != null) {
		if (openToggle) open++; else open--;
		openToggle = !openToggle;
		match = regex.exec(content);
	}
	while (open > 0) {
		content = content.slice(0, content.lastIndexOf(pattern));
		open--;
	}
	return content;
}

function getIndexers() {
	const overviewIndexer = (fileDataItems) => {
		console.log("overview..");

		let indexData = _.chain(fileDataItems)
			.sortBy(x => new Date(x.date))
			.reverse()
			.take(10)
			.map(x => {
				if (x.content.length > 1000) {
					let content = x.content.slice(0, 1000);
					// TODO: Use better excerpt generation.
					// WARNING: Could cut out links.
					content = stripStaticPattern(content, "```");
					content = content.replace(/\s+$/, "");
					return Object.assign({}, x, { content: content + " ..." });
				}
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
			.map(x => _.omit(x, "content"))
			.sortBy(x => new Date(x.date))
			.reverse()
			.value();
		
		return { data: indexData, name: "all" };
	};
	
	let indexers = [overviewIndexer, archivesIndexer, allIndexer];
	return indexers;
}

function runAll(opts) {
	console.log(chalk.green("ContentManager: starting all"));
	Commands.publishAll(opts.draftsDir, opts.publishedDir)
		.then(() => Commands.buildAll(opts.publishedDir, opts.contentDir))
		.then(() => Commands.buildIndexes(opts.contentDir, opts.indexDir, getIndexers()))
		.then(() => console.log(chalk.green("ContentManager: done")));
}

function runAllPublished(opts) {
	console.log(chalk.green("ContentManager: starting all published"));
	Commands.buildAll(opts.publishedDir, opts.contentDir)
		.then(() => Commands.buildIndexes(opts.contentDir, opts.indexDir, getIndexers()))
		.then(() => console.log(chalk.green("ContentManager: done")));
}

function getOpts() {
	let Paths = configConstantsFactory().Paths;	
	const draftsDir = path.join(__dirname, "./drafts");	
	const publishedDir = path.join(__dirname, "./published");
	const contentDir = path.join(Paths.dir, Paths.generatedContentDirRelativeName);	
	const indexDir = path.join(Paths.dir, Paths.generatedContentIndexesDirRelativeName);
	return { draftsDir, contentDir, indexDir, publishedDir };
}

function start() {
	const args = require("yargs");	
	const opts = getOpts();	
	args
		.command("publish", "publish a single draft", () => {
			const sources = args.argv._.filter((v, i) => i !== 0);
			if (sources[0] === undefined) {
				console.log(chalk.green("ContentManager: publishing all"));
				Commands.publishAll(opts.draftsDir, opts.publishedDir)
					.then(() => console.log(chalk.green("ContentManager: published all")));
			} else {
				sources.forEach(x => {
					let src;
					let p = path.join(process.cwd(), x);
					if (fs.existsSync(p)) {
						src = p;
					} else {
						p = path.join(opts.draftsDir, x);
						if (fs.existsSync(p)) {
							src = p;
						} else {
							console.error(chalk.red("Error: " + x + " not found"));
						}
					}
					if (src) {
						console.log(chalk.cyan("ContentManager: processing " + x));
						Commands.publish(src, opts.publishedDir)
							.then(() => console.log(chalk.green("ContentManager: published " + x)));
					}
				});
			}
		})
		.command("run-nopublish", "run all that has already been published", () => {
			runAllPublished(opts);
		});
	
	const rest = args.argv._;
	if (rest[0] === undefined) {
		runAll(opts);
	}
}

start();