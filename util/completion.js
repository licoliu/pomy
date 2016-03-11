"use strict";
var fs = require("fs"),
  path = require("path");
module.exports = function(o) {
  if ("string" != typeof o) throw new Error("Missing completion type");
  var e = path.join(__dirname, "../completion", o);
  try {
    console.log(fs.readFileSync(e, "utf8")), process.exit(0)
  } catch (t) {
    console.log('echo "pomy autocompletion rules for', "'" + o + "'", 'not found"'), process.exit(5)
  }
};