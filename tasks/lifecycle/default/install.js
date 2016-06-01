'use strict';

var
  gulp = require('gulp'),
  jeditor = require("gulp-json-editor");

gulp.task('install', ['verify'], function() {
  //TODO添加到本地bower cache
  var root = global.getRootPath();

  var version = global.settings.version;
  if (version) {
    var vs = version.split(".");

    if (vs.length > 3) {
      vs.splice(3, vs.length - 3);
    }

    if (global.settings.snapshort) {
      vs.push(new Date().getTime()).toString(16);
    }
  }

  return gulp.src([root + "pomy.json"])
    .pipe(jeditor({
      version: vs.join(".")
    }))
    .pipe(gulp.dest(root));
});