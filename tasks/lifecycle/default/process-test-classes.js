'use strict';

var
	gulp = require('gulp');

gulp.task('test-compile', ['process-test-resources'], function(cb) {
	cb();
});

gulp.task('process-test-classes', ['test-compile'], function(cb) {
	cb();
});