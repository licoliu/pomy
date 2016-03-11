'use strict';

var
  gulp = require('gulp'),
  del = require('del'),
  dest = global.settings.dest,
  // src = global.settings.src,
  target = global.settings.target;

gulp.task('clean', ['pre-clean'], function(cb) {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  var error = del([
    root + dest.fonts + '/*',
    root + dest.images + '/*',
    root + dest.template + '/*',
    root + dest.css + '/*',
    root + dest.skin + '/*',

    root + dest.jsrt + '/*',
    root + dest.rt,

    root + dest.lib + '/*',

    root + dest.js + '/*',
    root + dest.root,

    // root + src.css + '/**/*.css',
    // root + src.skin + '/**/*.css',

    root + target.root + "/*",

    //delete site's js and css
    //delete markdown's js and css
    pomy + 'site/plugins/docs/public/docs/jsdoc/*',

  ], {
    force: true
  }).then(function(deletedFiles) {
    console.log("##################################################");
    console.log("############### gulp clean finished. #############");
    console.log("##################################################");
    cb();
  }, function(err) {
    cb(err);
  });
});