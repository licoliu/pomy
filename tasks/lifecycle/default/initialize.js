'use strict';

var
  gulp = require('gulp');

gulp.task('initialize', ['dependancy'], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  return gulp.src([
      pomy + "bower_components/jre/**/*",
      "!" + pomy + "bower_components/jre/src/test/**/*",
      "!" + pomy + "bower_components/jre/jsvm.min.js",
      "!" + pomy + "bower_components/jre/*.json",
      "!" + pomy + "bower_components/jre/gulpfile.js"
    ])
    .pipe(gulp.dest(root + global.settings.dest.jre + "/"));
});