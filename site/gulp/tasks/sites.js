'use strict';

var
  gulp = require('gulp'),
  path = require('path'),
  // sequence = require('run-sequence'),
  spawn = require('child_process').spawn;

gulp.task('markdown', function(cb) {

  var cwd = path.join(process.cwd(), './plugins/markdown/');

  var args = [];
  var command = null;

  if (process.platform === "win32") {
    command = "cmd";
    args.push('/c');
    args.push(path.resolve(path.dirname(__filename), '../../node_modules/.bin/gulp'));
  } else {
    command = "../../node_modules/.bin/gulp";
  }

  args.push("build");
  args.push('--prod');

  var markdown = spawn(command, args, {
    cwd: cwd
  });

  markdown.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  markdown.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  markdown.on('exit', function(code) {
    console.log('Finish markdown site build process');
    cb();
  });
});

gulp.task('docs', function(cb) {

  var cwd = path.join(process.cwd(), './plugins/docs/');

  var args = [];
  var command = null;

  if (process.platform === "win32") {
    command = "cmd";
    args.push('/c');
    args.push(path.resolve(path.dirname(__filename), '../../node_modules/.bin/gulp'));
  } else {
    command = "../../node_modules/.bin/gulp";
  }

  args.push("build");
  args.push('--prod');

  var docs = spawn(command, args, {
    cwd: cwd
  });

  docs.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  docs.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  docs.on('exit', function(code) {
    console.log('Finish docs site build process');
    cb();
  });
});

gulp.task('changelog', function(cb) {

  var cwd = path.join(process.cwd(), './plugins/changelog/');

  var args = [];
  var command = null;

  if (process.platform === "win32") {
    command = "cmd";
    args.push('/c');
    args.push(path.resolve(path.dirname(__filename), '../../node_modules/.bin/gulp'));
  } else {
    command = "../../node_modules/.bin/gulp";
  }

  args.push("build");
  args.push('--prod');

  var changelog = spawn(command, args, {
    cwd: cwd
  });

  changelog.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  changelog.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  changelog.on('exit', function(code) {
    console.log('Finish changelog site build process');
    cb();
  });
});
gulp.task('sites', ['docs', 'markdown', 'changelog']);