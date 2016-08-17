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

  minifyCss = require('gulp-minify-css'),
  less = require('gulp-less'),
  //sass = require('gulp-sass'),
  minifyhtml = require('gulp-minify-html'),
  // exec = require('child_process').exec,
  spawn = require('child_process').spawn,
  livereload = require('gulp-livereload'),
  //browserSync = require('browser-sync'),
  dest = global.settings._dest,
  src = global.settings._src;

gulp.task('fonts', function() {
  var root = global.getRootPath();
  return gulp.src(root + src.fonts + "/**/*")
    .pipe(gulp.dest(root + dest.fonts))
    .pipe(livereload());
  //.pipe(browserSync.reload({
  //  stream: true
  //}));
});

gulp.task('skins:fonts', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.skin + "/*/fonts/**/*",
      root + src.skins + "/*/fonts/**/*"
    ])
    .pipe(gulp.dest(root + dest.skins))
    .pipe(livereload());
  //.pipe(browserSync.reload({
  //  stream: true
  //}));
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
    .pipe(livereload());
  //.pipe(browserSync.reload({
  //  stream: true
  //}));
});

gulp.task('skins:images', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.skin + "/*/images/**/*",
      root + src.skins + "/*/images/**/*"
    ])
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
    .pipe(gulp.dest(root + dest.skins))
    .pipe(livereload());
  //.pipe(browserSync.reload({
  //  stream: true
  //}));
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
    .pipe(livereload());
  //.pipe(browserSync.reload({
  //  stream: true
  //}));
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

gulp.task('skins:less', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.skin + '/*/css/**/*.less',
      root + src.skin + '/*/less/**/*.less',
      root + src.skins + '/*/css/**/*.less',
      root + src.skins + '/*/less/**/*.less'
    ])
    .pipe(less())
    .pipe(gulp.dest(root + src.skins));
});

gulp.task('sass', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.css + '/**/*.scss',
      root + src.css + '/**/*.sass',
      root + src.scss + '/**/*.scss',
      root + src.sass + '/**/*.sass'
    ])
    //.pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(root + src.css));
});

gulp.task('skins:sass', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.skin + '/*/css/**/*.scss',
      root + src.skin + '/*/css/**/*.sass',
      root + src.skin + '/*/css/**/*.scss',
      root + src.skin + '/*/css/**/*.sass',
      root + src.skins + '/*/css/**/*.scss',
      root + src.skins + '/*/css/**/*.sass',
      root + src.skins + '/*/css/**/*.scss',
      root + src.skins + '/*/css/**/*.sass'
    ])
    //.pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(root + src.skins));
});

gulp.task('css', ['less', 'sass'], function() {
  var root = global.getRootPath();
  return gulp.src(root + src.css + "/**/*.css")
    .pipe(gulpif(!global.settings.debug, minifyCss()))
    .pipe(gulp.dest(root + dest.css))
    .pipe(livereload());
  //.pipe(browserSync.reload({
  //  stream: true
  //}));
});

gulp.task('skins:css', ['skins:less', 'skins:sass'], function() {
  var root = global.getRootPath();
  return gulp.src([
      root + src.skin + "/*/css/**/*.css",
      root + src.skins + "/*/css/**/*.css"
    ])
    .pipe(gulpif(!global.settings.debug, minifyCss()))
    .pipe(gulp.dest(root + dest.skins))
    .pipe(livereload());
  //.pipe(browserSync.reload({
  //  stream: true
  //}));
});

gulp.task('resources', ['fonts', 'images', 'skins:images', 'template', 'css', 'skins:css'], function(cb) {
  cb();
});

gulp.task('process-resources', ['generate-resources'], function(cb) {
  var command = null,
    args = [];

  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
    // args.push("node");
  } else {
    command = "node";
  }

  if (global.settings.debug) {
    // exec(global.getCommandPath('gulp') + ' less skins:less --process child', {
    //   cwd: global.settings.cwd
    // }, function(err, stdout, stderr) {
    //   console.log(stdout);
    //   if (err) {
    //     return cb(err);
    //   }
    //   cb();
    // });

    args.push(global.getCommandPath('gulp'));
    args.push('less');
    args.push('skins:less');
    args.push('--process');
    args.push("child");

    var less = spawn(command, args, {
      cwd: global.settings.cwd,
      stdio: 'inherit'
    });

    less.on('close', function(code) {
      if (code !== 0) {
        cb(code);
      } else {
        cb();
      }
    });
  } else {
    // exec(global.getCommandPath('gulp') + ' resources --process child', {
    //   cwd: global.settings.cwd
    // }, function(err, stdout, stderr) {
    //   console.log(stdout);
    //   if (err) {
    //     return cb(err);
    //   }

    //   cb();
    // });

    args.push(global.getCommandPath('gulp'));
    args.push('resources');
    args.push('--process');
    args.push("child");

    var resources = spawn(command, args, {
      cwd: global.settings.cwd,
      stdio: 'inherit'
    });

    resources.on('close', function(code) {
      if (code !== 0) {
        cb(code);
      } else {
        cb();
      }
    });
  }
});