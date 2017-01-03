'use strict';

var
  gulp = require('gulp'),
  spawn = require('child_process').spawn;


gulp.task('initialize:jre', function() {
  return gulp.src([
      pomy + "bower_components/jre/jre/**/*",
      pomy + "bower_components/jre/startup-test.js",
      pomy + "bower_components/jre/index-test.html",

      "!" + pomy + "bower_components/jre/jre/jsvm.min.js"
      // "!" + pomy + "bower_components/jre/src",
      // "!" + pomy + "bower_components/jre/src/**/*",
      // "!" + pomy + "bower_components/jre/*.json",
      // "!" + pomy + "bower_components/jre/gulpfile.js"
    ], {
      base: pomy + "bower_components/jre/"
    })
    .pipe(gulp.dest(root));
});

gulp.task('initialize', ['dependancy'], function(cb) {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  var jre = global.settings.jre;
  if (jre) {
    cb();
  } else {
    if (process.platform === "win32") {
      command = "cmd";
      args.push("/c");
      // args.push("node");
    } else {
      command = "node";
    }

    args.push(global.getCommandPath('gulp'));
    args.push('initialize:jre');
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
  }

});