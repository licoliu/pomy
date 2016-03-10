'use strict';

var
	gulp = require('gulp'),
	fs = require('fs'),
	bower = require('gulp-bower');

gulp.task('dependancy', ['validate'], function(cb) {
	var pomy = global.getPomyPath();

	var directory = pomy + 'bower_components';

	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory);
	}

	return bower({
		cmd: 'update',
		cwd: pomy
	});
});