'use strict';

var
	gulp = require('gulp'),
	sequence = require('run-sequence'),
	devTasks = ['webpack:dev', 'sass'],
	buildTasks = ['webpack:build', 'sass'];

if (global.isProduction) {
	gulp.task('build', function(cb) {
		sequence(buildTasks, cb);
	});
} else {
	gulp.task('build', devTasks);
}
