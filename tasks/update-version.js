var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  config = require('config-file'),
  gulpif = require('gulp-if'),
  jeditor = require("gulp-json-editor");

gulp.task('update:version-self', [], function() {
  var version = gutil.env.v || gutil.env.version;
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "pomy.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(pomy));
});

gulp.task('update:version-node', [], function() {
  var version = gutil.env.v || gutil.env.version;
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "package.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(pomy));
});

gulp.task('update:version-bower', [], function() {
  var version = gutil.env.v || gutil.env.version;
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "bower.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(pomy));
});

gulp.task('update:version-site', [], function() {
  var version = gutil.env.v || gutil.env.version;
  var pomy = global.getPomyPath();
  return gulp.src(pomy + "site/package.json")
    .pipe(gulpif(!!version, jeditor({
      version: version
    })))
    .pipe(gulp.dest(pomy + "site/"));
});

gulp.task('update:version-docs', [], function() {
  var version = gutil.env.v || gutil.env.version;
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