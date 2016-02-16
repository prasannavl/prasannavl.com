/* eslint-disable no-console */

var _ = require("lodash");
var chalk = require("chalk");
var os = require("os");

module.exports = function(content) {
	console.log(os.EOL + chalk.cyan(this.resourcePath));
	console.log("Loaders:" + os.EOL + _(this.loaders).map(x => x.request).reduce((acc, v) => acc + os.EOL + v) + os.EOL);
	return content;
};

module.exports.raw = true;
