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
  //browserSync = require('browser-sync'),
  dest = global.settings.dest;

gulp.task("repack-bootstrap-woff2", function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2"
    ])
    .pipe(gulp.dest(root + dest.lib + "/bootstrap/fonts/"));
});
gulp.task("repack-bootstrap", ["repack-bootstrap-woff2"], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/bootstrap/dist/css/**/*",
      pomy + "bower_components/bootstrap/dist/fonts/**/*"
    ], {
      base: pomy + "bower_components/bootstrap/dist/"
    })
    .pipe(gulp.dest(root + dest.lib + "/bootstrap/"));
});

gulp.task("repack-fontawesome", function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/fontawesome/css/**/*",
      pomy + "bower_components/fontawesome/fonts/**/*"
    ], {
      base: pomy + "bower_components/fontawesome/"
    })
    .pipe(gulp.dest(root + dest.lib + "/fontawesome/"));
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

gulp.task("repack-google-code-prettify", function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/google-code-prettify/styles/desert.css",
      pomy + "bower_components/google-code-prettify/styles/doxy.css",
      pomy + "bower_components/google-code-prettify/styles/sons-of-obsidian.css",
      pomy + "bower_components/google-code-prettify/styles/sunburst.css"
    ])
    .pipe(gulp.dest(root + dest.lib + "/google-code-prettify/css/"));
});

gulp.task("repack-specs", [
  "repack-bootstrap",
  "repack-fontawesome",
  "repack-iCheck-css",
  "repack-angular-ui",
  "repack-google-code-prettify"
], function(cb) {
  var root = global.getRootPath();
  del([
    root + dest.lib + "/highstock-release/js/exporting.js",
    root + dest.lib + "/highstock-release/js/highcharts-more.js"
  ], {
    force: true
  }).then(function(deletedFiles) {
    cb();
  }, function(err) {
    cb(err);
  });
});

gulp.task("repack-folders-rename", ["repack-specs"], function() {
  var root = global.getRootPath();
  return gulp.src([root + dest.lib + '/*.*/**/*'])
    .pipe(rename(function(path) {
      // path.dirname path.basename path.extname
      path.dirname = path.dirname.replace(/[.]/g, "-");
    }))
    .pipe(gulp.dest(root + dest.lib));
});

gulp.task("repack-folders", ["repack-folders-rename"], function(cb) {
  var root = global.getRootPath();
  del([
    root + dest.lib + "/*.*"
  ], {
    force: true
  }).then(function(deletedFiles) {
    cb();
  }, function(err) {
    cb(err);
  });
});

gulp.task("repack-files-rename", ["repack-folders"], function() {
  var root = global.getRootPath();
  return gulp.src([root + dest.lib + '/**/*.js', root + dest.lib + '/**/*.css'])
    .pipe(rename(function(path) {
      // path.dirname path.basename path.extname
      path.basename = path.basename
        .replace(/(.min|.debug|.all)$/, "")
        .replace(/[.]/g, "-");
    }))
    .pipe(gulp.dest(root + dest.lib));
});

gulp.task("minify-csslib", ["repack-files-rename"], function() {
  var root = global.getRootPath();
  return gulp.src([root + dest.lib + '/**/*.css',
      "!" + root + dest.lib + "/**/*.*.css"
    ])
    .pipe(gulpif(!global.settings.debug, minifyCss()))
    .pipe(gulp.dest(root + dest.lib));
});

gulp.task("minify-jslib", ["minify-csslib"], function() {
  var root = global.getRootPath();
  return gulp.src([root + dest.lib + '/**/*.js',
      "!" + root + dest.lib + "/**/*.*.js"
    ])
    .pipe(gulpif(!global.settings.debug, uglify({
      mangle: {
        except: ['require', 'exports', 'module']
      }
    })))
    .pipe(gulp.dest(root + dest.lib));
});

gulp.task("define", ["minify-jslib"], function() {
  var before = '',
    after = '';
  var root = global.getRootPath();
  switch (global.settings.define) {
    case 'cmd':
      before = "define(function(require, exports, module) {\n";
      after = "\n});"; //;return exports;
      break;
    case 'amd':
      break;
    default:
      break;
  }
  return gulp.src([
      root + dest.lib + '/**/*.js',
      "!" + root + dest.lib + "/**/*.*.js",
      "!" + root + dest.lib + "/**/*.*.css"
    ])
    .pipe(insert.wrap(before, after))
    .pipe(gulp.dest(root + dest.lib))
    .pipe(livereload());
  //.pipe(browserSync.reload({
  //  stream: true
  //}));
});

gulp.task("repack", ["define"], function(cb) {
  var root = global.getRootPath();
  del([
    root + dest.lib + "/**/*.*.js",
    root + dest.lib + "/**/*.*.css"
  ], {
    force: true
  }).then(function(deletedFiles) {
    cb();
  }, function(err) {
    cb(err);
  });
});

gulp.task('process-classes', ['compile'], function(cb) {
  exec(global.getCommandPath('gulp') + ' repack --process child', {
    cwd: global.settings.cwd
  }, function(err, stdout, stderr) {
    console.log(stdout);
    if (err) {
      return cb(err);
    }
    cb();
  });
});