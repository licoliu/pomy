'use strict';

var
	browserSync = require('browser-sync'),
	gulp = require('gulp'),
	gutil = require('gulp-util');

gulp.task('browser-sync', function() {
	var env = gutil.env;
	browserSync({
		files: ['../src/main/**'],
		proxy: (env.domain || 'localhost') + ":" + (env.port || 8000),
		notify: false
	});
});
