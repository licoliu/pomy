'use strict';

var
  gulp = require('gulp'),
  bowerFiles = require('main-bower-files'),
  bowerNormalizer = require('gulp-bower-normalize'),
  dest = global.settings._dest,
  src = global.settings._src,
  settings = global.settings,
  spawn = require('child_process').spawn,
  rename = require('gulp-rename'),
  filter = require('gulp-filter');

gulp.task('process-samegroup', function(cb) {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  var directory = pomy + 'bower_components';
  var bowerJson = pomy + 'bower.json';
  var overrides = {};

  var result = {
    dependencies: {},
    overrides: {}
  };

  global.analyzeDep(global.settings, result);

  for (var dep in result.dependencies) {
    if (dep.indexOf(settings.group) !== 0 || dep === "jre") {
      overrides[dep] = {
        ignore: true
      };
    }
  }

  return gulp.src(bowerFiles({
      paths: {
        bowerDirectory: directory,
        bowerJson: bowerJson
      },
      overrides: overrides
    }), {
      base: directory
    })
    .pipe(filter(["**/*/src/main/**/*", "**/*/classes/**/*"]))
    .pipe(rename(function(path) {
      path.dirname = path.dirname
        .replace(/^([.A-z]*\/(src\/main|classes)[/]?)/g, "/")
        .replace(/[.]/g, "/");
    }))
    .pipe(gulp.dest(root + src.main));
});

gulp.task('process-diffgroup', function(cb) {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  var directory = pomy + 'bower_components';
  var bowerJson = pomy + 'bower.json';
  var overrides = {};

  var result = {
    dependencies: {},
    overrides: {}
  };

  global.analyzeDep(global.settings, result);

  for (var dep in result.dependencies) {
    if (dep.indexOf(settings.group) === 0 || dep === "jre") {
      overrides[dep] = {
        ignore: true
      };
    }
  }

  return gulp.src(bowerFiles({
      paths: {
        bowerDirectory: directory,
        bowerJson: bowerJson
      },
      overrides: overrides
    }), {
      base: directory
    })
    .pipe(bowerNormalizer({
      bowerJson: bowerJson
    }))
    .pipe(gulp.dest(root + dest.lib));
});

gulp.task('process-sources', ['generate-sources'], function(cb) {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  if (settings.repositoryManager === 'npm') {
    cb();
  } else {

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
    args.push('process-samegroup');
    args.push('process-diffgroup');
    args.push('--process');
    args.push("child");

    var format = spawn(command, args, {
      cwd: global.settings.cwd,
      stdio: 'inherit'
    });

    format.on('close', function(code) {
      if (code !== 0) {
        cb(code);
      } else {
        cb();
      }
    });
  }
});