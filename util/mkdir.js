'use strict';

var path = require('path'),
  fs = require('fs');

module.exports = function(source, orign) {
  var ref = source;
  var dirs = orign.split("/");
  var dir = null;
  for (var i = 0, len = dirs.length; i < len; i++) {
    dir = dirs[i];
    ref = path.join(ref, dir);
    if (!fs.existsSync(ref)) {
      fs.mkdirSync(ref);
    }
  }
};