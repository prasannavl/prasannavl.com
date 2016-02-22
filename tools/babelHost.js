"use strict";
/* eslint-disable no-console */
require("babel-register");
var args = process.argv;
if (args.length > 2) {  
    require(args[2]);
} else {
    console.log("BabelHost: No valid input");
}