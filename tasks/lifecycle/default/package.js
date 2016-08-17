'use strict';

var
  gulp = require('gulp'),
  zip = require('gulp-zip'),
  name = global.settings.name,
  settings = global.settings,
  target = settings._target;
// version = settings.version;

gulp.task('package', ['prepare-package'], function() {
  var root = global.getRootPath();
  return gulp.src(root + target.classes + "/**/*")
    .pipe(zip(name /* + "@" + version */ + '.zip'))
    .pipe(gulp.dest(root + target.root));
});