'use strict';

var
  gulp = require('gulp'),
  bowerFiles = require('main-bower-files'),
  bowerNormalizer = require('gulp-bower-normalize'),
  dest = global.settings._dest;

gulp.task('process-sources', ['generate-sources'], function(cb) {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  if (settings.repositoryManager === 'npm') {
    cb();
  } else {
    var directory = pomy + 'bower_components';
    var bowerJson = pomy + 'bower.json';

    return gulp.src(bowerFiles({
        paths: {
          bowerDirectory: directory,
          bowerJson: bowerJson
        }
      }), {
        base: directory
      })
      .pipe(bowerNormalizer({
        bowerJson: bowerJson
      }))
      .pipe(gulp.dest(root + dest.lib));
  }
});