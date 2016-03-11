'use strict';

var
  gulp = require('gulp'),
  // sequence = require('run-sequence'),
  devTasks = ['webpack:dev', 'sass', 'sites'],
  buildTasks = ['webpack:build', 'sass', 'sites'];

if (global.isProduction) {
  gulp.task('build', buildTasks, function(cb) {
    // sequence(buildTasks, cb);
    cb();
  });
} else {
  gulp.task('build', devTasks);
}