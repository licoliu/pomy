'use strict';

var
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  insert = require('gulp-insert'),
  minifyCss = require('gulp-minify-css'),
  // exec = require('child_process').exec,
  spawn = require('child_process').spawn,
  livereload = require('gulp-livereload'),
  //browserSync = require('browser-sync'),
  dest = global.settings._dest;

gulp.task("repack-iCheck", function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  return gulp.src([
      pomy + "bower_components/iCheck/skins/**/*"
    ])
    .pipe(gulp.dest(root + dest.lib + "/iCheck/skins/"));
});

gulp.task("repack-specs", ["repack-iCheck"], function(cb) {
  cb();
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
  // exec(global.getCommandPath('gulp') + ' repack --process child', {
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
  args.push('repack');
  args.push('--process');
  args.push("child");

  var repack = spawn(command, args, {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  repack.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});