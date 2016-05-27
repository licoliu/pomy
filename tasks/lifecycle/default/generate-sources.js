'use strict';

var
  gulp = require('gulp'),
  exec = require('child_process').exec;

gulp.task('generate-sources', ['initialize'], function(cb) {
  if (global.settings.debug) {
    exec(global.getCommandPath('gulp') + ' format --process child', {
      cwd: global.settings.cwd
    }, function(err, stdout, stderr) {
      console.log(stdout);
      if (err) {
        return cb(err);
      }
      cb();
    });
  } else {
    cb();
  }
});