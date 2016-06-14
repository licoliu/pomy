'use strict';

var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  rc = require('rc'),
  fs = require('fs'),
  util = require('util'),
  path = require('path'),
  config = require('config-file'),
  jeditor = require("gulp-json-editor"),
  minimist = require('minimist'),
  getConfigSettings = function() {
    var settings = util._extend({}, global.settings);

    settings.target = settings.env.target;
    var version = settings.version;
    if (version) {
      var vs = version.split(".");
      if (vs.length > 3) {
        vs.splice(3, vs.length - 3);
      }
      settings.version = vs.join(".");
    }

    delete settings.src;
    delete settings.dest;
    delete settings.testunit;
    // delete settings.target;
    delete settings.env;
    delete settings.cwd;

    return settings;
  };

global.getRootPath = function() {
  var cwd = process.cwd();
  if (/\/node_modules\/pomy$/g.test(cwd) ||
    /\\\\node_modules\\\\pomy$/g.test(cwd)) {
    return '../../';
  }
  return (minimist(process.argv.slice(2)).process === 'child') ? '../../' : './';
};

global.getPomyPath = function() {
  var cwd = process.cwd();
  if (/\/node_modules\/pomy$/g.test(cwd) ||
    /\\\\node_modules\\\\pomy$/g.test(cwd)) {
    return './';
  }
  return (minimist(process.argv.slice(2)).process === 'child') ? './' : './node_modules/pomy/';
};

global.getCommandPath = function(cmd) {
  cmd = cmd || "";
  if (fs.existsSync(path.join(global.settings.cwd, "./node_modules/.bin/" + cmd))) {
    return path.resolve(global.settings.cwd, "./node_modules/.bin/" + cmd);
  } else if (fs.existsSync(path.join(global.settings.cwd, "../.bin/" + cmd))) {
    return path.resolve(global.settings.cwd, "../.bin/" + cmd);
  } else {
    return cmd;
  }
};

global.settings = config(global.getRootPath() + "pomy.json");

var cwd = process.cwd();
global.settings.cwd = /\/node_modules\/pomy$/g.test(cwd) ||
  /\\\\node_modules\\\\pomy$/g.test(cwd) ? cwd : path.join(cwd, './node_modules/pomy/');

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
  less: 'src/main/less',
  scss: 'src/main/scss',
  sass: 'src/main/sass',
  skin: 'src/main/skin',
  skins: 'src/main/skins',
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
  skins: 'classes/skins',
  js: 'classes/js',
  template: 'classes/template',
  jre: 'jre',
  jsrt: 'jre/classes/js',
  rt: 'jre/classes',
  lib: 'lib'
};

gulp.task('pom', function() {
  global.settings.env = gutil.env;
  global.settings.env.target = (gutil.env.t || gutil.env.target || gutil.env.type || 'local').toLowerCase();
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

  var version = gutil.env.update || gutil.env.targetversion || gutil.env.tv || gutil.env.v || gutil.env.version;
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

  return gulp.src([root + "pomy.json", root + "bower.json"])
    .pipe(jeditor(getConfigSettings()))
    .pipe(gulp.dest(root));
});

gulp.task('config:bower', ['pom'], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  if (global.settings.jre) {
    delete global.settings.dependencies.jre;
    delete global.settings.devDependencies.jre;
  } else if (!global.settings.dependencies.jre &&
    !global.settings.devDependencies.jre) {
    global.settings.dependencies.jre = "^1.0.1";
  }

  var dependencies = [];
  for (var name in global.settings.dependencies) {
    dependencies.push(name);
  }
  var overrides = util._extend({
    "normalizeMulti": [{
      "dependencies": dependencies
    }]
  }, global.settings.overrides);
  return gulp.src(pomy + "bower.json")
    .pipe(jeditor({
      overrides: overrides,
      dependencies: global.settings.dependencies
    }))
    .pipe(gulp.dest(pomy));
});

gulp.task('config:npm', ['pom'], function() {
  var root = global.getRootPath();

  var settings = getConfigSettings();
  delete settings.dependencies;

  return gulp.src(root + "package.json")
    .pipe(jeditor(settings))
    .pipe(gulp.dest(root));
});

gulp.task('config', ['config:bower', 'config:npm'], function(cb) {
  var settings = getConfigSettings();
  rc(settings.name, settings);
  cb();
});