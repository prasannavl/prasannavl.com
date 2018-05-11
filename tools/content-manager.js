const commander = require("commander");
const path = require("path");
const fs = require("fs-extra");

function spread(arg, ...values) {
	return Object.assign({}, arg, ...values);
}

function defaultOptions() {
    return {
        draftsDir: path.join(__dirname, "../src/posts/drafts"),
        postsDir: path.join(__dirname, "../src/posts/"),
        notesDir: path.join(__dirname, "../src/posts/notes"),
        verbose: false,
    }
}

async function create(opts) {
    let { verbose, name, draftsDir, template, force } = opts;
    let data;
    if (template) {
        data = await fs.readFile(template);
    } else {
        data = getDraftTemplate();
    }
    if (name.endsWith(".js")) {
        name = name.slice(0, -3);
    }
    if (!name.endsWith(".jsx")) {
        name = name + ".jsx";
    }
    data = data.toString().replace(
        /(\s+)date(\s*):(\s*)""/,
        "$1date$2:$3\"" + new Date().toISOString() + "\"");
    
    let flag = force ? "w" : "wx";
    const p = path.join(draftsDir, "./" + name);
    await fs.writeFile(p, data, { flag });
    console.log(p);
}

async function publish(opts) {
    let { verbose, files, draftsDir, postsDir, notesDir, force } = opts;
}

function start() {
	let program = commander;
	let opts = defaultOptions();
	
    program
        .version("1.0.0")
        .option("--verbose", "verbose")
        .option("--force", "force")
        .option("-d, --drafts-dir [path]", "drafts location", x => path.resolve(x));
	
	program
		.command("publish [files...]")
        .description("publish all drafts or single provided draft")
        .option("-p, --posts-dir [path]", "published posts location", x => path.resolve(x))
		.option("-n, --notes-dir [path]", "published notes location", x => path.resolve(x))
		.action((files, env) => {
            publish(spread(opts, env.parent, { files }));
		});
	
	program
        .command("create <name>")
        .option("-t, --template [path]", "template location", x => path.resolve(x))        
		.description("create a new draft")
        .action((name, env) => {
            create(spread(opts, env.parent, env, { name }));
		});
	
	program.parse(process.argv);

	if (program.args.length < 1) {
		program.help();
	}
}

function getDraftTemplate() {
    return `import { Article, CodeBlock, Link } from "../../components/Article"; 

export const meta = {
    title: "",
    tags: [],
    note: true,
    date: "",
}

export default () => {
    return <Article {...meta}>
        
    </Article>
}`
}

start();