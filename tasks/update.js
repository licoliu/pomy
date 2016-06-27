var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  config = require('config-file'),
  gulpif = require('gulp-if'),
  jeditor = require("gulp-json-editor"),
  path = require('path'),
  gutil = require('gulp-util'),
  minimist = require('minimist'),
  spawn = require('child_process').spawn;

gulp.task('update:version-self', [], function() {
  var argvs = gutil.env;
  var version = argvs.v || argvs.version;
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "pomy.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(pomy));
});

gulp.task('update:version-node', [], function() {
  var argvs = gutil.env;
  var version = argvs.v || argvs.version;
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "package.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(pomy));
});

gulp.task('update:version-bower', [], function() {
  var argvs = gutil.env;
  var version = argvs.v || argvs.version;
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "bower.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(pomy));
});

gulp.task('update:version-site', [], function() {
  var argvs = gutil.env;
  var version = argvs.v || argvs.version;
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "site/package.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(pomy + "site/"));
});

gulp.task('update:version-docs', [], function() {
  var argvs = gutil.env;
  var version = argvs.v || argvs.version;
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "site/plugins/docs/package.json")
    .pipe(gulpif(!!version, jeditor({
      "version": version
    })))
    .pipe(gulp.dest(pomy + "site/plugins/docs/"));
});

gulp.task('update:version', [
  "update:version-self",
  "update:version-node",
  "update:version-bower",
  "update:version-site",
  "update:version-docs"
]);

gulp.task('update:self', function(cb) {

  var cwd = path.join(global.settings.cwd, '../../');

  var argvs = gutil.env;

  var args = [];
  var command = null;

  if (process.platform === "win32") {
    command = "cmd";
    args.push('/c');
    args.push("npm");
  } else {
    command = "npm";
  }

  args.push("update");
  args.push("pomy");

  if (argvs.g || argvs.global) {
    args.push("-g")
  }

  if (argvs.registry || global.settings.registry) {
    args.push("--registry");
    args.push(argvs.registry || global.settings.registry);
  }

  var npm = spawn(command, args, {
    cwd: cwd
  });

  npm.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  npm.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  npm.on('exit', function(code) {
    console.log('Finish pomy update self process');
    cb();
  });
});

gulp.task('update:pomy', ['update:self'], function(cb) {
  cb();
});

gulp.task('upgrade', ['update:self'], function(cb) {
  cb();
});