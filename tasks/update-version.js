var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  config = require('config-file'),
  gulpif = require('gulp-if'),
  jeditor = require("gulp-json-editor");

gulp.task('update:version-node', [], function() {
  var version = gutil.env.v || gutil.env.version;

  return gulp.src(global.settings.cwd + "package.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(global.settings.cwd));
});

gulp.task('update:version-bower', [], function(cb) {

  var version = gutil.env.v || gutil.env.version;

  return gulp.src(global.settings.cwd + "bower.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(global.settings.cwd));
});

gulp.task('update:version-site', [], function(cb) {

  var version = gutil.env.v || gutil.env.version;

  return gulp.src(global.settings.cwd + "site/package.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(global.settings.cwd + "site/"));
});

gulp.task('update:version-docs', [], function(cb) {

  var version = gutil.env.v || gutil.env.version;

  return gulp.src(global.settings.cwd + "site/plugins/docs/package.json")
    .pipe(gulpif(!!version, jeditor({
      "version": version
    })))
    .pipe(gulp.dest(global.settings.cwd + "site/plugins/docs/"));
});

gulp.task('update:version', [
  "update:version-node",
  "update:version-bower",
  "update:version-site",
  "update:version-docs"
]);