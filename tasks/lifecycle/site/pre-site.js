'use strict';

var
	gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn;

gulp.task('site-npm', function(cb) {
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

gulp.task('pre-site', ['site-npm'], function(cb) {
	var build = spawn('./node_modules/.bin/gulp', [
		'build', '--prod'
	], {
		cwd: path.join(global.settings.cwd, './site/')
	});

	build.stdout.on('data', function(data) {
		console.log(data.toString());
	});

	build.stderr.on('data', function(data) {
		console.error(data.toString());
	});

	build.on('exit', function(code) {
		console.log('Finish site build process');
		cb();
	});
});
