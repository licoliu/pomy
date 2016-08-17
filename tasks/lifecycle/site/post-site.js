'use strict';

var
  gulp = require('gulp'),
  zip = require('gulp-zip');

gulp.task('post-site', ['site'], function() {
  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    target = settings._target

  var root = global.getRootPath();

  return gulp.src([
      root + target.root + "/site/**/*",
      root + target.root + "/package.json",
      root + target.root + "/pomy.json",
      root + target.root + "/README.md",
      root + target.root + "/util/**/*"
    ], {
      base: root + target.root
    })
    .pipe(zip(name + ".site" /* + "@" + version */ + '.zip'))
    .pipe(gulp.dest(root + target.root));
});