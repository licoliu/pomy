'use strict';

var
// browserSync = require('browser-sync'),
  gulp = require('gulp'),
  gutil = require('gulp-util');

gulp.task('browser:sync', function(cb) {

  // var env = gutil.env || global.settings.site || {
  //   ips: ['127.0.0.1']
  // };
  // for (var i = 0, len = env.ips.length; i < len; i++) {
  //   var ip = env.ips[i];
  //   browserSync({
  //     files: ['../src/main/**'],
  //     proxy: ip + ":" + (env.syncPort || 8000),
  //     notify: false
  //   });
  // }
  cb();
});