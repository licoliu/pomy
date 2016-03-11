'use strict';

var
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cmq = require('gulp-group-css-media-queries'),
  csso = require('gulp-csso'),
  size = require('gulp-size'),
  gulpif = require('gulp-if'),
  rename = require('gulp-rename'),
  handleErrors = require('../util/handleErrors'),
  browserSync = require('browser-sync');

gulp.task('sass', function() {

  var dest = './public/css';

  return gulp.src('./public/scss/app.{scss,sass}')
    .pipe(sass({
      precision: 7,
      outputStyle: 'nested'
    }))
    .on('error', handleErrors)
    .pipe(autoprefixer())
    .pipe(gulpif(global.isProduction, cmq({
      log: true
    })))
    .pipe(csso())
    .pipe(rename("classes.all.css"))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(size());
});