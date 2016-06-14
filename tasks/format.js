 'use strict';

 var
   fs = require('fs'),
   gulp = require('gulp'),
   gulpif = require('gulp-if'),
   prettify = require('gulp-jsbeautifier'),
   livereload = require('gulp-livereload'),
   //browserSync = require('browser-sync'),
   src = global.settings.src,
   testunit = global.settings.testunit;

 gulp.task('jsbeautifyrc', function() {
   var root = global.getRootPath();
   var pomy = global.getPomyPath();

   return gulp.src(pomy + ".jsbeautifyrc")
     .pipe(gulp.dest(fs.existsSync(root + '.jsbeautifyrc') ? pomy : root));
 });

 gulp.task('format:html', ['jsbeautifyrc'], function() {
   var root = global.getRootPath();
   return gulp.src([
       root + src.template + "/**/*.html",
       root + src.template + "/**/*.ejs"
     ])
     .pipe(prettify({
       config: root + '.jsbeautifyrc'
     }))
     .pipe(gulp.dest(root + src.template))
     .pipe(livereload());
   //.pipe(browserSync.reload({
   //  stream: true
   //}));
 });

 gulp.task('format:css', ['jsbeautifyrc'], function() {
   var root = global.getRootPath();
   return gulp.src([
       root + src.css + "/**/*.css",
       root + src.css + "/**/*.less",
       root + src.css + "/**/*.sass",
       root + src.css + "/**/*.scss",
       root + src.less + "/**/*.less",
       root + src.sass + "/**/*.sass",
       root + src.scss + "/**/*.scss"
     ])
     .pipe(prettify({
       config: root + '.jsbeautifyrc'
     }))
     .pipe(gulp.dest(root + src.css))
     .pipe(livereload());
   //.pipe(browserSync.reload({
   //  stream: true
   //}));
 });

 gulp.task('format:skin', ['jsbeautifyrc'], function() {
   var root = global.getRootPath();
   return gulp.src([
       root + src.skin + "/**/*.css",
       root + src.skin + "/**/*.less",
       root + src.skin + "/**/*.sass",
       root + src.skin + "/**/*.scss",
       root + src.skins + "/**/*.css",
       root + src.skins + "/**/*.less",
       root + src.skins + "/**/*.sass",
       root + src.skins + "/**/*.scss"
     ])
     .pipe(prettify({
       config: root + '.jsbeautifyrc'
     }))
     .pipe(gulp.dest(root + src.skins))
     .pipe(livereload());
   //.pipe(browserSync.reload({
   //  stream: true
   //}));
 });
 gulp.task('format:skins', ["format:skin"], function(cb) {
   cb();
 });

 gulp.task('format:jsrt', ['jsbeautifyrc'], function() {
   var root = global.getRootPath();
   return gulp.src(root + src.jsrt + "/**/*.js")
     .pipe(gulpif(global.settings.jre, prettify({
       config: root + '.jsbeautifyrc',
       mode: 'VERIFY_AND_WRITE'
     })))
     .pipe(gulp.dest(root + src.jsrt))
     .pipe(livereload());
   //.pipe(browserSync.reload({
   //  stream: true
   //}));
 });

 gulp.task('format:js', ['jsbeautifyrc'], function() {
   var root = global.getRootPath();
   return gulp.src(root + src.js + "/**/*.js")
     .pipe(prettify({
       config: root + '.jsbeautifyrc',
       mode: 'VERIFY_AND_WRITE'
     }))
     .pipe(gulp.dest(root + src.js))
     .pipe(livereload());
   //.pipe(browserSync.reload({
   //  stream: true
   //}));
 });

 gulp.task('format', ['format:js', 'format:css', 'format:skins', 'format:html', 'format:jsrt'], function(cb) {
   cb();
 });

 gulp.task('format:test-jsrt', ['jsbeautifyrc'], function() {
   var root = global.getRootPath();
   return gulp.src(root + testunit.jsrt + "/**/*.js")
     .pipe(prettify({
       config: root + '.jsbeautifyrc',
       mode: 'VERIFY_AND_WRITE'
     }))
     .pipe(gulp.dest(root + testunit.jsrt));
 });

 gulp.task('format:test', ['format:test-jsrt'], function() {
   var root = global.getRootPath();
   return gulp.src(root + testunit.js + "/**/*.js")
     .pipe(prettify({
       config: root + '.jsbeautifyrc',
       mode: 'VERIFY_AND_WRITE'
     }))
     .pipe(gulp.dest(root + testunit.js))
     .pipe(livereload())
     //.pipe(browserSync.reload({
     //  stream: true
     //}));
 });

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

       "!" + pomy + "site/plugins/markdown/public/markdown/scss/vendor/bootstrap-sass-3.2.0/assets/stylesheets/bootstrap/_input-groups.scss",
       "!" + pomy + "site/plugins/markdown/public/markdown/scss/vendor/bootstrap-sass-3.2.0/assets/stylesheets/bootstrap/mixins/_reset-filter.scss",

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