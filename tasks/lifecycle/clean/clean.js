'use strict';

var
  gulp = require('gulp'),
  del = require('del'),
  dest = global.settings._dest,
  // src = global.settings._src,
  target = global.settings._target;

gulp.task('clean', ['pre-clean'], function(cb) {
  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  var files = [
    root + dest.fonts + '/*',
    root + dest.images + '/*',
    root + dest.template + '/*',
    root + dest.css + '/*',
    root + dest.skin + '/*',
    root + dest.skins + '/*',

    root + dest.jsrt + '/*',
    root + dest.rt,

    root + dest.lib + '/*',

    root + dest.js + '/*',
    root + dest.root,

    // root + src.css + '/**/*.css',
    // root + src.skin + '/**/*.css',
    // root + src.skins + '/**/*.css',

    root + target.root + "/*",

    //delete site's js and css
    //delete markdown's js and css
    pomy + 'site/plugins/docs/public/docs/jsdoc/*'
  ];

  var jre = global.settings.jre;
  if (jre) {
    files.push(root + jre.name + ".js");
    files.push(root + jre.uglify + ".js");
  }

  var error = del(files, {
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