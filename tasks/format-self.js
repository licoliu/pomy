 'use strict';

 var
   gulp = require('gulp'),
   prettify = require('gulp-jsbeautifier');

 gulp.task('format:self-html', function() {
   var pomy = global.getPomyPath();
   return gulp.src([
       pomy + "**/*.ejs",
       pomy + "**/*.html",

       "!" + pomy + "**/jsdoc/**/*",
       "!" + pomy + "**/node_modules/**/*",
       "!" + pomy + "**/bower_components/**/*"
     ])
     .pipe(prettify({
       config: pomy + '.jsbeautifyrc'
     }))
     .pipe(gulp.dest(pomy));
 });

 gulp.task('format:self-css', function() {
   var pomy = global.getPomyPath();
   return gulp.src([
       pomy + "**/*.css",
       pomy + "**/*.less",
       pomy + "**/*.scss",
       pomy + "**/*.sass",

       "!" + pomy + "**/classes.all.css",
       "!" + pomy + "**/node_modules/**/*",
       "!" + pomy + "**/bower_components/**/*"
     ])
     .pipe(prettify({
       config: pomy + '.jsbeautifyrc'
     }))
     .pipe(gulp.dest(pomy));
 });

 gulp.task('format:self-js', function() {
   var pomy = global.getPomyPath();
   return gulp.src([
       pomy + "**/*.js",
       pomy + "**/*.json",

       "!" + pomy + "**/classes.all.js",
       "!" + pomy + "**/node_modules/**/*",
       "!" + pomy + "**/bower_components/**/*"
     ])
     .pipe(prettify({
       config: pomy + '.jsbeautifyrc',
       mode: 'VERIFY_AND_WRITE'
     }))
     .pipe(gulp.dest(pomy));
 });

 gulp.task('format:self', ['format:self-js', 'format:self-css', 'format:self-html'], function(cb) {
   cb();
 });