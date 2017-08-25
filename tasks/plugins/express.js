'use strict';

var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  fs = require('fs'),
  util = require('util'),
  jeditor = require("gulp-json-editor"),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec;

gulp.task('express:startup-config', ['pom'], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  var configPath = null;

  if (!fs.existsSync(path.join(root, "startup.json"))) {
    configPath = pomy + "startup.json";
  } else {
    configPath = root + "startup.json";
  }

  return gulp.src(configPath)
    .pipe(jeditor({
      apps: [{
        name: global.settings.name
      }]
    }))
    .pipe(gulp.dest(root));
});

gulp.task('express:startup', ['express:startup-config'], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  var configPath = [];

  if (!fs.existsSync(path.join(root, "startup.js"))) {
    configPath.push(pomy + "startup.js");
  } else {
    configPath.push(root + "startup.js");
  }

  if (!fs.existsSync(path.join(root, "logo.ico"))) {
    configPath.push(pomy + "logo.ico");
  }

  return gulp.src(configPath)
    .pipe(gulp.dest(root));
});

gulp.task('express:pom', ['express:startup'], function() {
  var root = global.getRootPath();

  var settings = getConfigSettings();

  var plugins = settings.plugins;
  for (var i in plugins) {
    util._extend(settings.dependencies, plugins[i].dependencies || {});
    util._extend(settings.devDependencies, plugins[i].devDependencies || {});
  }

  if (settings.repositoryManager !== 'npm') {
    delete settings.dependencies;
  }

  return gulp.src(root + "package.json")
    .pipe(jeditor(settings))
    .pipe(gulp.dest(root));
});


gulp.task('express:npm', ["express:pom"], function(cb) {
  var root = global.getRootPath();
  var cwd = path.join(root);

  var args = [];
  var command = null;

  if (process.platform === "win32") {
    command = "cmd";
    args.push('/c');
    args.push("npm");
  } else {
    command = "npm";
  }

  args.push("install");

  var registry = gutil.env.registry || global.settings.registry;
  if (registry) {
    args.push("--registry");
    args.push(registry);
  }

  var npm = spawn(command, args, {
    cwd: cwd,
    stdio: 'inherit'
  });

  npm.on('close', function(code) {
    if (code !== 0) {
      console.log('site npm process exit with code: ' + code + '.');
      cb(code);
    } else {
      cb();
    }
  });
});

var execute = function(_command, cb) {
  var command = "",
    args = [];

  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('gulp'))
  args.push(_command);
  args.push('--process');
  args.push("child");

  var startup = spawn(command, args, {
    cwd: path.join(global.settings.cwd),
    stdio: 'inherit'
  });

  startup.on('close', function(code) {
    if (code !== 0) {
      console.log('task ' + _command + ' process exited with code: ' + code + ".");
      cb(code);
    } else {
      cb();
    }
  });
};

gulp.task('express:restart', ['express:npm'], function(cb) {
  execute('restart', cb);
});

gulp.task('express:rebuild', ['express:npm'], function(cb) {
  execute('rebuild', cb);
});

gulp.task('express:delete', ['express:pom'], function(cb) {
  execute('delete', cb);
});

gulp.task('express:stop', ['express:pom'], function(cb) {
  execute('stop', cb);
});

gulp.task('express:start', ['express:npm'], function(cb) {
  execute('start', cb);
});

gulp.task('express:run', ['express:npm'], function(cb) {
  execute('run', cb);
});