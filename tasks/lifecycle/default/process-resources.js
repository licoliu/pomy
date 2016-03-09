'use strict';

var
  gulp = require('gulp'),
  gulpif = require('gulp-if'),

  //imagemin = require('gulp-imagemin'),
  //"imagemin-gifsicle": "^4.1.0",
  //"imagemin-jpegtran": "^4.1.0",
  //"imagemin-optipng": "^4.2.0",
  //"imagemin-svgo": "^4.1.2",
  //optipng = require('imagemin-optipng'),
  //gifsicle = require('imagemin-gifsicle'),
  //svgo = require('imagemin-svgo'),
  //jpegtran = require('imagemin-jpegtran'),

  del = require('del'),
  minifyCss = require('gulp-minify-css'),
  less = require('gulp-less'),
  sass = require('gulp-sass'),
  minifyhtml = require('gulp-minify-html'),
  exec = require('child_process').exec,
  livereload = require('gulp-livereload'),
  browserSync = require('browser-sync'),
  dest = global.settings.dest,
  src = global.settings.src;

gulp.task('fonts', function() {
  var root = global.getRootPath();
  return gulp.src(root + src.fonts + "/**/*")
    .pipe(gulp.dest(root + dest.fonts))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('images', function() {
  var root = global.getRootPath();
  return gulp.src(root + src.images + "/**/*")
    /*.pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [
        optipng(), svgo(), jpegtran({
                progressive: true
              }), gifsicle({
                interlaced: true
              })
      ]
    }))*/
    .pipe(gulp.dest(root + dest.images))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('skin-images', function() {
  var root = global.getRootPath();
  return gulp.src(root + src.skin + "/*/images/**/*")
    /*.pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [
        optipng(), svgo(), jpegtran({
                progressive: true
              }), gifsicle({
                interlaced: true
              })
      ]
    }))*/
    .pipe(gulp.dest(root + dest.skin))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('template', function() {
  var root = global.getRootPath();
  return gulp.src(root + src.template + "/**/*.html")
    .pipe(gulpif(!global.settings.debug, minifyhtml({
      empty: true,
      cdata: true,
      spare: false,
      conditionals: true,
      quotes: true
    })))
    .pipe(gulp.dest(root + dest.template))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('less', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.css + '/**/*.less',
      root + src.less + '/**/*.less'
    ])
    .pipe(less())
    .pipe(gulp.dest(root + src.css));
});

gulp.task('skin-less', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.skin + '/*/css/**/*.less',
      root + src.skin + '/*/less/**/*.less'
    ])
    .pipe(less())
    .pipe(gulp.dest(root + src.skin));
});

gulp.task('sass', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.css + '/**/*.scss',
      root + src.css + '/**/*.sass',
      root + src.scss + '/**/*.scss',
      root + src.sass + '/**/*.sass'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(root + src.css));
});

gulp.task('skin-sass', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.css + '/**/*.scss',
      root + src.css + '/**/*.sass',
      root + src.scss + '/**/*.scss',
      root + src.sass + '/**/*.sass'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(root + src.skin));
});

gulp.task('css', ['less', 'sass'], function() {
  var root = global.getRootPath();
  return gulp.src(root + src.css + "/**/*.css")
    .pipe(gulpif(!global.settings.debug, minifyCss()))
    .pipe(gulp.dest(root + dest.css))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('skin-css', ['skin-less', 'skin-sass'], function() {
  var root = global.getRootPath();
  return gulp.src(root + src.skin + "/*/css/**/*.css")
    .pipe(gulpif(!global.settings.debug, minifyCss()))
    .pipe(gulp.dest(root + dest.skin))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('resources', ['fonts', 'images', 'skin-images', 'template', 'css', 'skin-css'], function(cb) {
  cb();
});

gulp.task('process-resources', ['generate-resources'], function(cb) {

  if (global.settings.debug) {
    exec('gulp less skin-less --process child', {
      cwd: global.settings.cwd
    }, function(err, stdout, stderr) {
      console.log(stdout);
      if (err) {
        return cb(err);
      }
      cb();
    });
  } else {
    exec('gulp resources --process child', {
      cwd: global.settings.cwd
    }, function(err, stdout, stderr) {
      console.log(stdout);
      if (err) {
        return cb(err);
      }

      var error = del([
        //src.css + '/**/*.css',
        //src.skin + '/**/*.css',
      ], function(err, deletedFiles) {
        cb(err);
      });
    });
  }
});
