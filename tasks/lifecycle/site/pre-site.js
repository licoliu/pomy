'use strict';

'use strict';

var
	gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn;

gulp.task('site-npm', ["config"], function(cb) {

	var npm = spawn("npm", [
		'update',
		"--registry",
		"https://registry.npm.taobao.org"
	], {
		cwd: path.join(global.settings.cwd, './site/')
	});

	npm.stdout.on('data', function(data) {
		console.log(data.toString());
	});

	npm.stderr.on('data', function(data) {
		console.error(data.toString());
	});

	npm.on('exit', function(code) {
		console.log('Finish pre-site process');
		cb();
	});
});

gulp.task('jsdoc', ["site-npm"], function(cb) {

	var jsdoc = spawn('./node_modules/.bin/jsdoc', [
		'-c', '.jsdoc'
	], {
		cwd: path.join(global.settings.cwd, './site/')
	});

	jsdoc.stdout.on('data', function(data) {
		console.log(data.toString());
	});

	jsdoc.stderr.on('data', function(data) {
		console.error(data.toString());
	});

	jsdoc.on('exit', function(code) {
		console.log('Finish jsdoc process');
		cb();
	});
});

gulp.task('pre-site', ["jsdoc"], function(cb) {
	cb()
});
