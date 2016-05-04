'use strict';

var
  gulp = require('gulp'),
  zip = require('gulp-zip');

gulp.task('site-config', function(cb) {

  var root = global.getRootPath();

  var settings = global.settings,
    target = settings.target;

  var srcs = [
    root + 'package.json',
    root + 'pomy.json',
    root + 'README.md'
  ];

  return gulp.src(srcs, {
      base: root
    })
    .pipe(gulp.dest(root + target.root));
});

gulp.task('post-site', ['site', 'site-config'], function(cb) {
  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    target = settings.target

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
    .pipe(zip(name + ".site@" + version + '.zip'))
    .pipe(gulp.dest(root + target.root));
});