'use strict';

var
  gulp = require('gulp'),
  fs = require('fs'),
  path = require('path'),
  gutil = require('gulp-util'),
  spawn = require('child_process').spawn;

gulp.task('site-npm', ["config:pm2site"], function(cb) {

  var cwd = path.join(global.settings.cwd, './site/');

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

gulp.task('pre-site', ['site-npm'], function(cb) {

  var cwd = path.join(global.settings.cwd, './site/');

  var args = [];
  var command = null;

  if (process.platform === "win32") {
    command = "cmd";
    args.push('/c');
    args.push(path.resolve(cwd, './node_modules/.bin/gulp'));
  } else {
    command = path.resolve(cwd, './node_modules/.bin/gulp');
  }

  args.push('build');
  args.push('--prod');

  var build = spawn(command, args, {
    cwd: cwd,
    stdio: 'inherit'
  });

  build.on('close', function(code) {
    if (code !== 0) {
      console.log('site build process exit with code: ' + code + '.');
      cb(code);
    } else {
      cb();
    }
  });

});