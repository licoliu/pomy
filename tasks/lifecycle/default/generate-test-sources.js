'use strict';

var
  gulp = require('gulp'),
  prettify = require('gulp-jsbeautifier'),
  exec = require('child_process').exec,
  livereload = require('gulp-livereload'),
  browserSync = require('browser-sync'),
  testunit = global.settings.testunit;

gulp.task('testunit-jsrt', ['jsbeautifyrc'], function() {
  var root = global.getRootPath();
  return gulp.src(root + testunit.jsrt + "/**/*.js")
    .pipe(prettify({
      config: root + '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest(root + testunit.jsrt));
});

gulp.task('testunit', ['testunit-jsrt'], function() {
  var root = global.getRootPath();
  return gulp.src(root + testunit.js + "/**/*.js")
    .pipe(prettify({
      config: root + '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest(root + testunit.js))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('generate-test-sources', ['process-classes'], function(cb) {
  if (global.settings.debug) {
    exec(global.getCommandPath('gulp') + ' testunit --process child', {
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