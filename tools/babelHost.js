"use strict";
/* eslint-disable no-console */
require("babel-register");
var args = require("yargs").argv;
if (args.run) {  
    require(args.run);
} else {
    console.log("BabelHost: No input");
}