'use strict';

var
  gulp = require('gulp'),
  // exec = require('child_process').exec,
  spawn = require('child_process').spawn;

gulp.task('generate-sources', ['initialize'], function(cb) {
  if (global.settings.debug) {
    // exec(global.getCommandPath('gulp') + ' format --process child', {
    //   cwd: global.settings.cwd
    // }, function(err, stdout, stderr) {
    //   console.log(stdout);
    //   if (err) {
    //     return cb(err);
    //   }
    //   cb();
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

    args.push(global.getCommandPath('gulp'));
    args.push('format');
    args.push('--process');
    args.push("child");

    var format = spawn(command, args, {
      cwd: global.settings.cwd,
      stdio: 'inherit'
    });

    format.on('close', function(code) {
      if (code !== 0) {
        cb(code);
      } else {
        cb();
      }
    });
  } else {
    cb();
  }
});