'use strict';

var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'build', 'browserSync'], function() {
  gulp.watch('public/changelog/scss/**/*.{scss,sass,css}', ['sass']);
});