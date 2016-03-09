'use strict';

var
  gulp = require('gulp'),
  // prettify = require('gulp-jsbeautifier'),
  jsHint = require('gulp-jshint'),
  exec = require('child_process').exec,
  fs = require('fs'),
  testunit = global.settings.testunit,
  src = global.settings.src;

gulp.task('jshint', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.js + "/**/*.js",
      // root + src.jsrt + "/**/*.js",
      // root + testunit.jsrt + "/**/*.js",
      root + testunit.js + "/**/*.js"
    ])
    .pipe(jsHint())
    .pipe(jsHint.reporter('default'));
});

gulp.task('jsbeautifyrc', function(cb) {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();


  if (!fs.existsSync(root + '.jsbeautifyrc')) {
    return gulp.src(pomy + ".jsbeautifyrc")
      .pipe(gulp.dest(root));
  } else {
    cb();
  }
});

gulp.task('prettify', ['jsbeautifyrc'], function(cb) {
  var root = global.getRootPath();
  return gulp.src(root + src.js + "/**/*.js")
    .pipe(prettify({
      config: root + '.jsbeautifyrc',
      mode: 'VERIFY_ONLY'
    }));
});

gulp.task('validate', ['config'], function(cb) {
  if (global.settings.debug) {
    exec('./node_modules/.bin/gulp jshint --process child', {
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