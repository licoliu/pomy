'use strict';

var
  gulp = require('gulp');

gulp.task('initialize', ['dependancy'], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  return gulp.src([
      pomy + "bower_components/jre/jre/**/*",
      pomy + "bower_components/jre/startup-test.js",
      pomy + "bower_components/jre/index-test.html",

      "!" + pomy + "bower_components/jre/jre/jsvm.min.js"
      // "!" + pomy + "bower_components/jre/src",
      // "!" + pomy + "bower_components/jre/src/**/*",
      // "!" + pomy + "bower_components/jre/*.json",
      // "!" + pomy + "bower_components/jre/gulpfile.js"
    ], {
      base: pomy + "bower_components/jre/"
    })
    .pipe(gulp.dest(root));
});