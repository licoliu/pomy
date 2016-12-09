'use strict';

var
  gulp = require('gulp'),
  prettify = require('gulp-jsbeautifier'),
  jsHint = require('gulp-jshint'),
  // exec = require('child_process').exec,
  spawn = require('child_process').spawn,
  testunit = global.settings._testunit,
  src = global.settings._src;

gulp.task('jshint', function() {
  var root = global.getRootPath();

  var srcs = null,
    jre = global.settings.jre;

  if (jre) {
    srcs = [
      root + src.jsrt + "/**/*.js",
      root + testunit.jsrt + "/**/*.js"
    ];
  } else {
    srcs = [
      root + src.js + "/**/*.js",
      root + testunit.js + "/**/*.js"
    ];
  }

  return gulp.src(srcs)
    .pipe(jsHint())
    .pipe(jsHint.reporter('default'));
});

gulp.task('prettify', ['jsbeautifyrc'], function() {
  var root = global.getRootPath();
  return gulp.src(root + src.js + "/**/*.js")
    .pipe(prettify({
      config: root + '.jsbeautifyrc',
      mode: 'VERIFY_ONLY'
    }))
    .pipe(gulp.dest(root + src.js));
});

gulp.task('validate', ['config'], function(cb) {
  if (global.settings.debug) {
    // exec(global.getCommandPath('gulp') + ' jshint --process child', {
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
    args.push('jshint');
    args.push('--process');
    args.push("child");

    var jshint = spawn(command, args, {
      cwd: global.settings.cwd,
      stdio: 'inherit'
    });

    jshint.on('close', function(code) {
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