'use strict';

var
  gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  gulpif = require('gulp-if'),
  exec = require('child_process').exec,
  livereload = require('gulp-livereload'),
  //browserSync = require('browser-sync'),
  dest = global.settings.dest,
  src = global.settings.src;

gulp.task('jsrt', function() {
  var root = global.getRootPath();
  return gulp.src(root + src.jsrt + "/**/*.js")
    .pipe(uglify({
      mangle: {
        except: ['require', 'exports', 'module']
      }
    }))
    .pipe(gulp.dest(root + dest.jsrt));
});

gulp.task('jre', ["jsrt"], function() {
  var root = global.getRootPath();
  return gulp.src(root + src.jre + "/jsvm.js")
    .pipe(uglify({
      mangle: {
        except: ['require', 'exports', 'module']
      }
    }))
    .pipe(gulp.dest(root + dest.jre));
});

gulp.task('js', ["jre"], function() {
  var root = global.getRootPath();
  return gulp.src(root + src.js + "/**/*.js")
    .pipe(uglify({
      mangle: {
        except: ['require', 'exports', 'module']
      }
    }))
    .pipe(gulp.dest(root + dest.js))
    .pipe(livereload())
    //.pipe(browserSync.reload({
    //  stream: true
    //}));
});

gulp.task('compile', ['process-resources'], function(cb) {
  if (!global.settings.debug) {
    exec(global.getCommandPath('gulp') + ' js --process child', {
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
  console.log("###################################################");
  console.log("############## gulp compile finished. #############");
  console.log("###################################################");
});