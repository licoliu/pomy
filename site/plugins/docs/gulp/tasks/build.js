'use strict';

var
    gulp = require('gulp'),
    sequence = require('run-sequence'),
    devTasks = ['webpack:dev', 'sass', 'doc'],
    buildTasks = ['webpack:build', 'sass', 'doc'];

if (global.isProduction) {
    gulp.task('build', function(cb) {
        sequence(buildTasks, cb);
    });
} else {
    gulp.task('build', devTasks);
}