'use strict';

var
  gulp = require('gulp'),
  jeditor = require("gulp-json-editor");

gulp.task('install', ['verify'], function(cb) {
  //TODO添加到本地bower cache
  cb();
});

gulp.task('publish', ['verify'], function(cb) {
  //TODO注册到bower, npm
});