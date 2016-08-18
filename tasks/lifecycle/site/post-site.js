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
      root + target.site + "/site/**/*",
      root + target.site + "/package.json",
      root + target.site + "/pomy.json",
      root + target.site + "/README.md",
      root + target.site + "/util/**/*"
    ], {
      base: root + target.site
    })
    .pipe(zip(name + ".site" /* + "@" + version */ + '.zip'))
    .pipe(gulp.dest(root + target.root));
});