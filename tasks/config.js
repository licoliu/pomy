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

    var version = "" + settings.version;
    var vs = version.split(".");
    if (vs.length > 3) {
      vs.splice(3, vs.length - 3);
    }
    settings.version = vs.join(".");

    delete settings._src;
    delete settings._dest;
    delete settings._testunit;
    delete settings._target;
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

global.settings = config(global.getRootPath() + "pomy.json") || {};

var cwd = process.cwd();
global.settings.cwd = /\/node_modules\/pomy$/g.test(cwd) ||
  /\\\\node_modules\\\\pomy$/g.test(cwd) ? cwd : path.join(cwd, './node_modules/pomy/');

global.settings._target = {
  root: 'target',
  classes: 'target/classes',
  site: 'target/site'
};

global.settings._testunit = {
  jsrt: 'jre/src/test',
  js: 'src/test'
};

global.settings._src = {
  root: 'src',
  main: 'src/main',
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

global.settings._dest = {
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
  global.settings.target = global.settings.env.target;
  switch (global.settings.env.target) {
    case "production":
    case "prod":
    case "release":
      global.settings.debug = false;
      global.settings.skin = "default";
      break;
    case "uat":
    case "production_uat":
    case "staging":
      global.settings.debug = false;
      global.settings.skin = "uat";
      break;
    case "fat":
    case "production_fat":
      global.settings.debug = false;
      global.settings.skin = "fat";
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

  var ips = gutil.env.ips;
  if (ips) {
    if (typeof ips === 'string') {
      global.settings.site.ips = [ips];
    } else {
      global.settings.site.ips = ips;
    }
  }

  var port = gutil.env.port;
  if (port) {
    global.settings.site.port = port;
  }

  var sitePort = gutil.env.sitePort;
  if (sitePort) {
    global.settings.site.sitePort = sitePort;
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

  if (global.settings.jre &&
    !global.settings.dependencies.jre &&
    !global.settings.devDependencies.jre) {
    global.settings.dependencies.jre = "^1.0.1";
  }
  // delete global.settings.dependencies.jre;
  // delete global.settings.devDependencies.jre;

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

gulp.task('config:pm2site', ['pom'], function() {
  var settings = global.settings,
    site = global.settings.site,
    ip = site.ips && site.ips.length > 0 ? site.ips[0] : '127.0.0.1';
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "site/startup.json")
    .pipe(jeditor({
      "apps": [{
        "name": settings.name + ".site",
        "args": "--ip " + ip +
          " --port " + site.sitePort +
          " --target " + settings.target +
          " --debug " + settings.debug
      }]
    }))
    .pipe(gulp.dest(pomy + "site/"));
});

gulp.task('config:startup', ['pom'], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "startup.json",
      pomy + "startup.js"
    ])
    .pip(gulp.dest(root));
});

gulp.task('config:pm2', ['pom'], function() {
  var settings = global.settings,
    site = global.settings.site,
    ip = site.domain || 'localhost';
  var root = global.getRootPath();
  return gulp.src(root + "startup.json")
    .pipe(jeditor({
      "apps": [{
        "name": settings.name,
        "args": "--ip " + ip +
          " --port " + site.port +
          " --target " + settings.target +
          " --debug " + settings.debug
      }]
    }))
    .pipe(gulp.dest(root));
});

gulp.task('config', ['config:bower', 'config:npm', 'config:pm2'], function() {
  var settings = getConfigSettings();
  var root = global.getRootPath();

  rc(settings.name, settings);

  var version = settings.version;

  if (settings.snapshort) {
    version = version + "." + new Date().getTime().toString(16);
  }

  global.settings.version = version;

  return gulp.src([root + "pomy.json"])
    .pipe(jeditor({
      version: version
    }))
    .pipe(gulp.dest(root));
});