'use strict';

var
  gulp = require('gulp'),
  prettify = require('gulp-jsbeautifier'),
  exec = require('child_process').exec,
  livereload = require('gulp-livereload'),
  browserSync = require('browser-sync'),
  src = global.settings.src;

gulp.task('format-html', ['jsbeautifyrc'], function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.template + "/**/*.html",
      root + src.template + "/**/*.ejs"
    ])
    .pipe(prettify({
      config: root + '.jsbeautifyrc'
    }))
    .pipe(gulp.dest(root + src.template))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('format-css', ['jsbeautifyrc'], function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.css + "/**/*.css",
      root + src.css + "/**/*.less",
      root + src.css + "/**/*.sass",
      root + src.css + "/**/*.scss",
      root + src.less + "/**/*.less",
      root + src.sass + "/**/*.sass",
      root + src.scss + "/**/*.scss"
    ])
    .pipe(prettify({
      config: root + '.jsbeautifyrc'
    }))
    .pipe(gulp.dest(root + src.css))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('format-skin', ['jsbeautifyrc'], function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.skin + "/**/*.css",
      root + src.skin + "/**/*.less",
      root + src.skin + "/**/*.sass",
      root + src.skin + "/**/*.scss"
    ])
    .pipe(prettify({
      config: root + '.jsbeautifyrc'
    }))
    .pipe(gulp.dest(root + src.skin))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('format-jsrt', ['jsbeautifyrc'], function() {
  var root = global.getRootPath();
  return gulp.src(root + src.jsrt + "/**/*.js")
    .pipe(prettify({
      config: root + '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest(root + src.jsrt))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('format-js', ['jsbeautifyrc'], function() {
  var root = global.getRootPath();
  return gulp.src(root + src.js + "/**/*.js")
    .pipe(prettify({
      config: root + '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest(root + src.js))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('format', ['format-js', 'format-css', 'format-skin', 'format-html' /*,'format-jsrt'*/ ], function(cb) {
  cb();
});

gulp.task('generate-sources', ['initialize'], function(cb) {
  if (global.settings.debug) {
    exec('gulp format --process child', {
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