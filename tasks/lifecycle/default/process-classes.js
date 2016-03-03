'use strict';

var
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  insert = require('gulp-insert'),
  minifyCss = require('gulp-minify-css'),
  exec = require('child_process').exec,
  livereload = require('gulp-livereload'),
  browserSync = require('browser-sync'),
  dest = global.settings.dest;

gulp.task("repack-mousewheel", function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/jquery-mousewheel/js/jquery.mousewheel.js"
    ])
    .pipe(rename("jquery-mousewheel.js"))
    .pipe(gulp.dest(root + dest.lib + "/jquery-mousewheel/js/"));
});

gulp.task("repack-malihu-css", function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/malihu-custom-scrollbar-plugin/css/jquery.mCustomScrollbar.css"
    ])
    .pipe(rename("jquery-mCustomScrollbar.css"))
    .pipe(gulp.dest(root + dest.lib + "/malihu-custom-scrollbar-plugin/css/"));
});

gulp.task("repack-malihu", ["repack-malihu-css"], function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/malihu-custom-scrollbar-plugin/js/jquery.mCustomScrollbar.js"
    ])
    .pipe(rename("jquery-mCustomScrollbar.js"))
    .pipe(gulp.dest(root + dest.lib + "/malihu-custom-scrollbar-plugin/js/"));
});

gulp.task("repack-ionrangeslider-skin", function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/ionrangeslider/css/ion.rangeSlider.skinNice.css"
    ])
    .pipe(rename("ion-rangeSlider-skinNice.css"))
    .pipe(gulp.dest(root + dest.lib + "/ionrangeslider/css/"));
});

gulp.task("repack-ionrangeslider-css", ["repack-ionrangeslider-skin"], function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/ionrangeslider/css/ion.rangeSlider.css"
    ])
    .pipe(rename("ion-rangeSlider.css"))
    .pipe(gulp.dest(root + dest.lib + "/ionrangeslider/css/"));
});

gulp.task("repack-ionrangeslider", ["repack-ionrangeslider-css"], function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/ionrangeslider/js/ion.rangeSlider.js"
    ])
    .pipe(rename("ion-rangeSlider.js"))
    .pipe(gulp.dest(root + dest.lib + "/ionrangeslider/js/"));
});

gulp.task("repack-angular-strap-tpl", function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();


  return gulp.src([
      pomy + "bower_components/angular-strap/dist/angular-strap.tpl.js"
    ])
    .pipe(rename("angular-strap-tpl.js"))
    .pipe(gulp.dest(root + dest.lib + "/angular-strap/js/"));
});

gulp.task("repack-bootstrap-woff2", function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2"
    ])
    .pipe(gulp.dest(root + dest.lib + "/bootstrap/fonts/"));
});

gulp.task("repack-easing", function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/jquery-easing-original/js/jquery.easing.js"
    ])
    .pipe(rename("jquery-easing.js"))
    .pipe(gulp.dest(root + dest.lib + "/jquery-easing-original/js/"));
});

gulp.task("repack-animate-css", function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/animate.css/css/**/*"
    ])
    .pipe(gulp.dest(root + dest.lib + "/animate/css/"));
});

gulp.task("repack-iCheck-png", function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/iCheck/skins/square/**/*.png"
    ])
    .pipe(gulp.dest(root + dest.lib + "/iCheck/skins/square/"));
});

gulp.task("repack-iCheck-css", ["repack-iCheck-png"], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/iCheck/skins/square/_all.css"
    ])
    .pipe(gulp.dest(root + dest.lib + "/iCheck/skins/square/"));
});

gulp.task("repack-iCheck", ["repack-iCheck-css"], function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/iCheck/js/icheck.min.js"
    ])
    .pipe(rename("iCheck.js"))
    .pipe(gulp.dest(root + dest.lib + "/iCheck/js/"));
});
gulp.task("repack-angular-ui-tree", function() {
  var root = global.getRootPath();
  return gulp.src([
      root + dest.lib + "/angular-ui-tree/css/angular-ui-tree.min.css"
    ])
    .pipe(rename("angular-ui-tree.css"))
    .pipe(gulp.dest(root + dest.lib + "/angular-ui-tree/css/"));
});


gulp.task("repack-angular-ui-css", function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/angular-ui/build/angular-ui.css"
    ])
    .pipe(gulp.dest(root + dest.lib + "/angular-ui/css/"));
});
gulp.task("repack-angular-ui", ["repack-angular-ui-css"], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/angular-ui/build/angular-ui.js"
    ])
    .pipe(gulp.dest(root + dest.lib + "/angular-ui/js/"));
});

gulp.task("repack-file", [
  "repack-mousewheel",
  "repack-malihu",
  "repack-ionrangeslider",
  "repack-angular-strap-tpl",
  "repack-bootstrap-woff2",
  "repack-animate-css",
  "repack-iCheck",
  "repack-angular-ui-tree",
  "repack-angular-ui",
  "repack-easing"
], function(cb) {
  var root = global.getRootPath();
  del([
    root + dest.lib + "/jquery-mousewheel/js/jquery.mousewheel.js",
    root + dest.lib + "/malihu-custom-scrollbar-plugin/js/jquery.mCustomScrollbar.js",
    root + dest.lib + "/malihu-custom-scrollbar-plugin/css/jquery.mCustomScrollbar.css",
    root + dest.lib + "/ionrangeslider/js/ion.rangeSlider.js",
    root + dest.lib + "/ionrangeslider/css/ion.rangeSlider.css",
    root + dest.lib + "/ionrangeslider/css/ion.rangeSlider.skinNice.css",
    root + dest.lib + "/highstock-release/js/exporting.js",
    root + dest.lib + "/highstock-release/js/highcharts-more.js",
    root + dest.lib + "/jquery-easing-original/js/jquery.easing.js",
    root + dest.lib + "/animate.css",
    root + dest.lib + "/iCheck/js/icheck.min.js"
  ], function(err, deletedFiles) {
    cb(err);
  });
});

gulp.task("repack-jslib", ["repack-file"], function() {
  var root = global.getRootPath();
  return gulp.src(root + dest.lib + '/**/*.js')
    .pipe(gulpif(!global.settings.debug, uglify({
      mangle: true
    })))
    .pipe(gulp.dest(root + dest.lib));
});

gulp.task("repack-csslib", ["repack-file"], function() {
  var root = global.getRootPath();
  return gulp.src(root + dest.lib + '/**/*.css')
    .pipe(gulpif(!global.settings.debug, minifyCss()))
    .pipe(gulp.dest(root + dest.lib));
});

gulp.task("define", ["repack-csslib", "repack-jslib"], function() {
  var before = '',
    after = '';
  var root = global.getRootPath();
  switch (global.settings.define) {
    case 'cmd':
      before = "define(function(require, exports, module) {";
      after = "});"; //;return exports;
      break;
    case 'amd':
      break;
    default:
      break;
  }
  return gulp.src(root + dest.lib + '/**/*.js')
    .pipe(insert.wrap(before, after))
    .pipe(gulp.dest(root + dest.lib))
    .pipe(livereload())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('process-classes', ['compile'], function(cb) {
  exec('gulp define --process child', {
    cwd: global.settings.cwd
  }, function(err, stdout, stderr) {
    console.log(stdout);
    if (err) {
      return cb(err);
    }
    cb();
  });
});
