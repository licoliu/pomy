'use strict';

var
  gulp = require('gulp'),
  zip = require('gulp-zip'),
  name = global.settings.name,
  version = global.settings.version,
  settings = global.settings,
  target = settings.target;

gulp.task('post-site', ['site'], function(cb) {
  var root = global.getRootPath();
  return gulp.src(root + target.root + "/site/**/*")
    .pipe(zip(name + ".site@" + version + '.zip'))
    .pipe(gulp.dest(target.root));
});