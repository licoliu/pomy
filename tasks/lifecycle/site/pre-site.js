'use strict';

var
  gulp = require('gulp'),
  fs = require('fs'),
  path = require('path'),
  gutil = require('gulp-util'),
  spawn = require('child_process').spawn;

gulp.task('site-npm', function(cb) {

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

  args.push("update");

  if (gutil.env.registry || settings.registry) {
    args.push("--registry");
    args.push(gutil.env.registry || settings.registry);
  }

  var npm = spawn(command, args, {
    cwd: cwd
  });

  npm.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  npm.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  npm.on('exit', function(code) {
    console.log('Finish site npm process');
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
    cwd: cwd
  });

  build.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  build.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  build.on('exit', function(code) {
    console.log('Finish site build process');
  });

});