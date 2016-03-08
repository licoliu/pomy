'use strict';

var
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	rc = require('rc'),
	util = require('util'),
	config = require('config-file'),
	jeditor = require("gulp-json-editor"),
	minimist = require('minimist'),
	getConfigSettings = function() {
		var settings = util._extend({}, global.settings);
		delete settings.src;
		delete settings.dest;
		delete settings.testunit;
		delete settings.target;
		delete settings.env;
		delete settings.cwd;
		return settings;
	};

global.getRootPath = function() {
	if (/\/node_modules\/pomy$/g.test(process.cwd())) {

		return '../../';
	}
	return (minimist(process.argv.slice(2)).process === 'child') ? '../../' : './';
}

global.getPomyPath = function() {

	if (/\/node_modules\/pomy$/g.test(process.cwd())) {
		return './';
	}
	return (minimist(process.argv.slice(2)).process === 'child') ? './' : global.settings.cwd;
}

global.settings = config(global.getRootPath() + "pomy.json");

global.settings.cwd = /\/node_modules\/pomy$/g.test(process.cwd()) ? './' : './node_modules/pomy/';

global.settings.target = {
	root: 'target',
	classes: 'target/classes',
	site: {
		doc: 'target/site/doc',
		api: 'target/site/api',
		markdown: 'target/site/markdown'
	}
};

global.settings.testunit = {
	jsrt: 'jre/src/test',
	js: 'src/test'
};

global.settings.src = {
	root: 'src',
	fonts: 'src/main/fonts',
	images: 'src/main/images',
	css: 'src/main/css',
	skin: 'src/main/skin',
	js: 'src/main/js',
	template: 'src/main/template',
	jre: 'jre',
	jsrt: 'jre/src/main/js',
	rt: 'jre/src',
	core: 'jre/jsvm.js'
};

global.settings.dest = {
	root: 'classes',
	fonts: 'classes/fonts',
	images: 'classes/images',
	css: 'classes/css',
	skin: 'classes/skin',
	js: 'classes/js',
	template: 'classes/template',
	jre: 'jre',
	jsrt: 'jre/classes/js',
	rt: 'jre/classes',
	lib: 'lib'
};

gulp.task('pom', function() {
	global.settings.env = gutil.env;
	global.settings.env.target = (gutil.env.t || gutil.env.target || gutil.env.type || '').toLowerCase();
	switch (global.settings.env.target) {
		case "production":
		case "prod":
		case "release":
			global.settings.debug = false;
			global.settings.skin = "default";
			break;
		case "fat":
		case "production_fat":
			global.settings.debug = false;
			global.settings.skin = "fat";
			break;
		case "uat":
		case "production_uat":
		case "staging":
			global.settings.debug = false;
			global.settings.skin = "uat";
			break;
		case "test":
		case "matrix":
			global.settings.debug = false;
			global.settings.skin = "test";
			break;
		case "local":
		case "snapshort":
		default:
			global.settings.debug = true;
			global.settings.skin = "default";
			break;
	}

	var version = gutil.env.v || gutil.env.version;
	if (version) {
		global.settings.version = version;
	}

	var skin = gutil.env.s || gutil.env.skin;
	if (skin) {
		global.settings.skin = skin;
	}

	if (!global.settings.site) {
		global.settings.site = {};
	}

	var domain = gutil.env.domain;
	if (domain) {
		global.settings.site.domain = domain;
	}

	var port = gutil.env.port;
	if (port) {
		global.settings.site.port = port;
	}

	var syncPort = gutil.env.syncPort;
	if (syncPort) {
		global.settings.site.syncPort = syncPort;
	}

	global.settings.author = gutil.env.author || global.settings.author || '';

	global.settings.keywords = gutil.env.keywords || global.settings.keywords || '';

	global.settings.googleWebmasterMeta = gutil.env.googleWebmasterMeta || global.settings.googleWebmasterMeta || '';

	global.settings.title = gutil.env.title || global.settings.title || '';

	global.settings.description = gutil.env.description || global.settings.description || '';

	var root = global.getRootPath();
	return gulp.src(root + "pomy.json")
		.pipe(jeditor(getConfigSettings()))
		.pipe(gulp.dest(root));
});

gulp.task('bower-config', ['pom'], function() {
	var root = global.getRootPath();
	return gulp.src(global.settings.cwd + "bower.json")
		.pipe(jeditor({
			dependencies: global.settings.dependencies
		}))
		.pipe(gulp.dest(global.settings.cwd));
});

gulp.task('npm-config', ['pom'], function() {
	var root = global.getRootPath();

	var settings = getConfigSettings();
	delete settings.dependencies;

	return gulp.src(root + "package.json")
		.pipe(jeditor(settings))
		.pipe(gulp.dest(root));
});

gulp.task('config', ['bower-config', 'npm-config'], function(cb) {
	var settings = getConfigSettings();
	rc(settings.name, settings);
	cb();
});
