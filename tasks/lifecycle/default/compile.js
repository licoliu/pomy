'use strict';

var
  path = require('path'),
  gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  // exec = require('child_process').exec,
  spawn = require('child_process').spawn,
  livereload = require('gulp-livereload'),
  //browserSync = require('browser-sync'),
  dest = global.settings._dest,
  src = global.settings._src;

gulp.task('jsrt', function() {
  var root = global.getRootPath();

  var jre = global.settings.jre;
  if (jre) {
    for (var i = 0, len = jre.files.length; i < len; i++) {
      jre.files[i] = path.join(root, jre.files[i]);
    }
    return gulp.src(jre.files)
      .pipe(concat(jre.name + ".js"))
      .pipe(gulp.dest(root + dest.jre));
  } else {
    return gulp.src(root + src.jsrt + "/**/*.js")
      .pipe(uglify({
        mangle: {
          except: ['require', 'exports', 'module']
        }
      }))
      .pipe(gulp.dest(root + dest.jsrt));
  }
});

gulp.task('jre', ["jsrt"], function() {
  var root = global.getRootPath();
  var jre = global.settings.jre;
  if (jre) {
    return gulp.src(root + src.jre + "/" + jre.name + ".js")
      .pipe(uglify({
        mangle: {
          except: ['require', 'exports', 'module']
        }
      }))
      .pipe(rename((jre.uglify || (jre.name + ".min")) + ".js"))
      .pipe(gulp.dest(root + dest.jre));
  } else {
    return gulp.src(root + src.jre + "/jsvm.js")
      .pipe(uglify({
        mangle: {
          except: ['require', 'exports', 'module']
        }
      }))
      .pipe(gulp.dest(root + dest.jre));
  }
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
  var command = null,
    args = [];

  if (!global.settings.debug) {
    // exec(global.getCommandPath('gulp') + ' js --process child', {
    //   cwd: global.settings.cwd
    // }, function(err, stdout, stderr) {
    //   console.log(stdout);
    //   if (err) {
    //     return cb(err);
    //   }
    //   cb();
    // });

    if (process.platform === "win32") {
      command = "cmd";
      args.push("/c");
      // args.push("node");
    } else {
      command = "node";
    }

    args.push(global.getCommandPath('gulp'));
    args.push('js');
    args.push('--process');
    args.push("child");

    var js = spawn(command, args, {
      cwd: global.settings.cwd,
      stdio: 'inherit'
    });

    js.on('close', function(code) {
      if (code !== 0) {
        cb(code);
      } else {
        cb();
      }
    });
  } else {
    if (global.settings.jre) {
      // exec(global.getCommandPath('gulp') + ' jsrt --process child', {
      //   cwd: global.settings.cwd
      // }, function(err, stdout, stderr) {
      //   console.log(stdout);
      //   if (err) {
      //     return cb(err);
      //   }
      //   cb();
      // });

      if (process.platform === "win32") {
        command = "cmd";
        args.push("/c");
        // args.push("node");
      } else {
        command = "node";
      }

      args.push(global.getCommandPath('gulp'));
      args.push('jsrt');
      args.push('--process');
      args.push("child");

      var jsrt = spawn(command, args, {
        cwd: global.settings.cwd,
        stdio: 'inherit'
      });

      jsrt.on('close', function(code) {
        if (code !== 0) {
          cb(code);
        } else {
          cb();
        }
      });
    } else {
      cb();
    }
  }
  console.log("###################################################");
  console.log("############## gulp compile finished. #############");
  console.log("###################################################");
});