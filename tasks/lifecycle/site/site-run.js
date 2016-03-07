'use strict';

var
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	spawn = require('child_process').spawn;

gulp.task('site:run', function(cb) {

	var domain = global.settings.env.domain;
	var port = global.settings.env.port;
	var target = global.settings.env.target;
	var version = global.settings.version;
	var debug = global.settings.debug;

	var author = global.settings.author;
	var keywords = global.settings.keywords;
	var googleWebmasterMeta = global.settings.googleWebmasterMeta;
	var title = global.settings.title;
	var description = global.settings.description;

	var startup = spawn('node', [
		"./startup",
		'--domain', domain,
		'--port', port,
		'--target', target,
		'--version', version,
		'--debug', debug,
		'--author', author,
		'--keywords', keywords,
		'--googleWebmasterMeta', googleWebmasterMeta,
		'--title', title,
		'--description', description
	], {
		cwd: global.settings.cwd + 'site/'
	});

	startup.stdout.on('data', function(data) {
		console.log(data.toString());
	});

	startup.stderr.on('data', function(data) {
		console.error(data.toString());
	});

	startup.on('exit', function(code) {
		console.log('site startup process exited with code ' + code);
	});

});
