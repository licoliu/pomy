'use strict';

var gulp = require('gulp'),
  testunit = global.settings.testunit,
  src = global.settings.src;

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(src.template, ['format:html', 'template']);
  gulp.watch(src.css + "/**/*.less", ['format:css', 'css', 'less']);
  gulp.watch(src.css + "/**/*.scss", ['format:css', 'css', 'sass']);
  gulp.watch(src.css + "/**/*.sass", ['format:css', 'css', 'sass']);
  gulp.watch(src.skin + '/*/css/**/*.less', ['format:skin', 'skins:css', 'skins:less']);
  gulp.watch(src.skin + '/*/css/**/*.scss', ['format:skin', 'skins:css', 'skins:sass']);
  gulp.watch(src.skin + '/*/css/**/*.sass', ['format:skin', 'skins:css', 'skins:sass']);
  gulp.watch(src.skins + '/*/css/**/*.less', ['format:skins', 'skins:css', 'skins:less']);
  gulp.watch(src.skins + '/*/css/**/*.scss', ['format:skins', 'skins:css', 'skins:sass']);
  gulp.watch(src.skins + '/*/css/**/*.sass', ['format:skins', 'skins:css', 'skins:sass']);
  gulp.watch(src.js, ['format:js', 'js']);
  gulp.watch(src.images, ['images']);
  gulp.watch(src.fonts, ['fonts']);
  gulp.watch(src.jsrt, ['jre']);
  gulp.watch([testunit.js, testunit.jsrt], ['format:test']);
  gulp.watch('./bower.json', ['define']);
});