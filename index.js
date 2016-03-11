'use strict';

var
  gulp = require('gulp'),
  path = require('path'),

  onlyScripts = require('./util/script-filter'),
  folderDetect = require('./util/folder-detect');

folderDetect.detectSync(path.join(__dirname, './tasks/'), function(fileName) {
  [fileName].filter(onlyScripts).forEach(function(task) {
    require('./' + task.substring(__dirname.length + 1));
  })
});

module.exports = gulp;