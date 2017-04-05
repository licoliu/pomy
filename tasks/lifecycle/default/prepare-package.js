'use strict';

var
  gulp = require('gulp'),
  path = require('path'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  filter = require('gulp-filter'),
  rename = require('gulp-rename'),
  minifyCss = require('gulp-minify-css'),
  // exec = require('child_process').exec,
  spawn = require('child_process').spawn,
  src = global.settings._src,
  dest = global.settings._dest,
  testunit = global.settings._testunit,
  target = global.settings._target;

gulp.task('output', function(cb) {
  if (!global.settings.output) {
    return cb();
  }

  var jsFilter = filter('**/*.js', {
    restore: true
  });
  var cssFilter = filter('**/*.css', {
    restore: true
  });

  var root = global.getRootPath();

  var main = [];
  if (Array.isArray(global.settings.main)) {
    for (var i in global.settings.main) {
      main.push(path.join(root, global.settings.main[i]));
    }
  } else {
    main = global.settings.main;
  }

  return gulp.src(main)
    .pipe(filter([
      "**/*.*",
      "../../**/*.*"
    ]))
    .pipe(jsFilter)
    .pipe(gulpif(!global.settings.debug, uglify({
      mangle: {
        except: ['require', 'exports', 'module']
      }
    })))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(gulpif(!global.settings.debug, minifyCss()))
    .pipe(cssFilter.restore)
    .pipe(rename(function(_path) {
      _path.dirname = "";
    }))
    .pipe(gulp.dest(path.join(root, global.settings.output)));
});

gulp.task('copy-jre', function() {
  var root = global.getRootPath();
  if (global.settings.debug) {
    return gulp.src([
        '!' + root + dest.rt + '/**/*',
        '!' + root + dest.rt,
        root + src.jre + '/**/*'
      ], {
        base: root
      })
      .pipe(gulp.dest(root + target.classes));
  } else {
    return gulp.src([
        '!' + root + src.rt + '/**/*',
        '!' + root + src.rt,
        // '!' + root + testunit.jsrt + '/**/*',
        root + dest.jre + '/**/*'
      ], {
        base: root
      })
      .pipe(gulp.dest(root + target.classes));
  }
});

gulp.task('copy-pm2', function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  var libs = [];
  if (global.settings.repositoryManager === 'npm') {
    libs.push(pomy + "node_modules/pm2/**/*");
    libs.push(pomy + "node_modules/semver/**/*");
  }

  return gulp.src(libs, {
      base: pomy
    })
    .pipe(gulp.dest(root + target.classes));
});

gulp.task('copy-lib', ['copy-pm2'], function() {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();
  var libs = [];
  if (global.settings.repositoryManager === 'npm') {
    libs.push(root + "node_modules/**/*");
    libs.push("!" + root + "node_modules/pomy/**/*");
    libs.push("!" + root + "node_modules/.bin/pomy");
  }

  libs.push(root + dest.lib + '/**/*');

  return gulp.src(libs, {
      base: root
    })
    .pipe(gulp.dest(root + target.classes));
});

gulp.task('copy-classes', function() {
  var root = global.getRootPath();
  if (global.settings.debug) {
    return gulp.src([
        root + src.root + '/**/*',
        "!" + root + src.root + '/**/*.prod',
        "!" + root + src.root + '/**/*.uat',
        "!" + root + src.root + '/**/*.fat',
        "!" + root + src.root + '/**/*.test',
        "!" + root + src.root + '/**/*.local'
      ], {
        base: root
      })
      .pipe(gulp.dest(root + target.classes));
  } else {
    return gulp.src([
        root + dest.root + '/**/*'
      ], {
        base: root
      })
      .pipe(gulp.dest(root + target.classes));
  }
});

gulp.task('copy-miscellaneous', function() {
  var root = global.getRootPath();
  return gulp.src([
      root + 'logo.ico',
      root + 'favicon.ico',
      root + 'index*.html',
      root + 'index*.ejs',
      root + 'package.json',
      root + 'startup.json',
      root + 'README.md',
      root + 'pomy.json',
      root + 'startup.js',
      root + '*.js'
    ])
    .pipe(gulp.dest(root + target.classes));
});

/* 将运行时前端文件拷贝至target
 *  1.jre, 
 *  2.lib, 
 *  3.classes,
 *  4.logo.ico, 
 *  5.index.html, 
 *  6.pomy.json
 */
gulp.task('prepare-package', ['test'], function(cb) {
  // exec(global.getCommandPath('gulp') + ' copy-jre copy-lib copy-classes copy-miscellaneous --process child', {
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
  args.push('copy-jre');
  args.push('copy-lib');
  args.push('copy-classes');
  args.push('copy-miscellaneous');
  args.push('output');
  args.push('--process');
  args.push("child");

  var copy = spawn(command, args, {
    cwd: global.settings.cwd,
    stdio: 'inherit'
  });

  copy.on('close', function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
});