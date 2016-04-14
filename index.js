'use strict';

var
  gulp = require('gulp'),
  path = require('path'),

  filters = require('./util/filters'),
  folderDetect = require('./util/folder-detect');

folderDetect.detectSync(path.join(__dirname, './tasks/'), function(task) {
  if (filters.script(task)) {
    require('./' + task.substring(__dirname.length + 1));
  }
});

module.exports = gulp;