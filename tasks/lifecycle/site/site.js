'use strict';

var
	gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn;

gulp.task('jsdoc', function(cb) {

	var command = null;

	if (fs.existsSync(path.join(global.settings.cwd, '../.bin/jsdoc'))) {
		command = '../.bin/jsdoc';
	} else {
		command = './node_modules/.bin/jsdoc';
	}
	var jsdoc = spawn(command, [
		'-c', '.jsdoc'
	], {
		cwd: global.settings.cwd
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

gulp.task('site', ['jsdoc', 'pre-site'], function() {
	var root = global.getRootPath();
	var pomy = global.getPomyPath();

	var srcs = [
		pomy + 'site/public/**/*',
		pomy + 'site/routes/**/*',
		pomy + 'site/views/**/*',
		pomy + 'site/startup.js',
		pomy + 'site/package.json',
		pomy + 'site/plugins/**/*',
		pomy + 'site/README.md',
		pomy + 'package.json',

		'!' + pomy + 'site/plugins/**/node_modules/**/*',
		'!' + pomy + 'site/**/gulp/**/*',
		'!' + pomy + 'site/**/gulpfile.js',
		'!' + pomy + 'site/**/karma.cofig.js',
		'!' + pomy + 'site/**/webpack.cofig.js',

		pomy + 'node_modules/**/*'
	];

	// var dependencies = require('../../../package.json').dependencies;
	// if (dependencies) {
	// 	for (var i in dependencies) {
	// 		srcs.push(pomy + 'node_modules/' + i + '/**/*');
	// 		var subdeps = require('../../../node_modules/' + i + "/package.json").dependencies;
	// 		for (var j in subdeps) {
	// 			srcs.push(pomy + 'node_modules/' + j + '/**/*');
	// 		}
	// 	}
	// }

	return gulp.src(srcs, {
			base: pomy
		})
		.pipe(gulp.dest(root + global.settings.target.root));
});
