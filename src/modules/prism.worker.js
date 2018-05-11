self.Prism = {
    disableWorkerMessageHandler: true,
};

const Prism = require("prismjs");
const prism_c = require("prismjs/components/prism-c");
const prism_cpp = require("prismjs/components/prism-cpp");
const prism_bash = require("prismjs/components/prism-bash");
const prism_csharp = require("prismjs/components/prism-csharp");

export function highlight({ code, lang }) { 
    return Prism.highlight(code, Prism.languages[lang], lang);
}