'use strict';

var
  gulp = require('gulp'),
  fs = require('fs'),
  // bower = require('gulp-bower'),
  spawn = require('child_process').spawn;

gulp.task('dependancy', ['validate'], function(cb) {
  var pomy = global.getPomyPath();

  var directory = pomy + 'bower_components';

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  // return bower({
  //   cmd: 'update',
  //   cwd: pomy
  // });

  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('bower'));
  args.push('update');

  var bower = spawn(command, args, {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  bower.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('update', function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('bower'));
  args.push('update');

  var bower = spawn(command, args.concat(process.argv.slice(3)), {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  bower.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('bower:update', ['update'], function(cb) {
  cb();
});

gulp.task('bower:install', function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('bower'));
  args.push('install');

  var bower = spawn(command, args.concat(process.argv.slice(3)), {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  bower.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('bower:uninstall', function(cb) {
  var command = null,
    args = [];
  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('bower'));
  args.push('uninstall');

  var bower = spawn(command, args.concat(process.argv.slice(3)), {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  bower.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});