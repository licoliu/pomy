'use strict';

var
  gulp = require('gulp');

gulp.task('site-config', function() {

  var root = global.getRootPath();

  var settings = global.settings,
    target = settings._target;

  var srcs = [
    root + 'package.json',
    root + 'pomy.json',
    root + 'README.md'
  ];

  return gulp.src(srcs, {
      base: root
    })
    .pipe(gulp.dest(root + target.root));
});

gulp.task('site', ['site-config', 'pre-site'], function() {

  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  var settings = global.settings,
    target = settings._target;

  var srcs = [
    // pomy + 'package.json',
    // pomy + 'pomy.json',

    pomy + 'site/startup.js',
    pomy + 'site/node_modules/**/*',
    pomy + 'util/**/*',

    pomy + 'site/**/routes/**/*',
    pomy + 'site/**/views/**/*',
    pomy + 'site/package.json',
    pomy + 'site/README.md',

    pomy + 'site/**/public/**/*',
    pomy + 'site/**/plugins/**/*',

    '!' + pomy + 'site/plugins/**/node_modules/**/*',
    '!' + pomy + 'site/**/public/js/**/*',
    '!' + pomy + 'site/**/public/*/js/**/*',
    '!' + pomy + 'site/**/public/**/scss/**/*',
    '!' + pomy + 'site/**/gulp/**/*',
    '!' + pomy + 'site/**/gulpfile.js',
    '!' + pomy + 'site/**/karma.cofig.js',
    '!' + pomy + 'site/**/webpack.cofig.js'
  ];

  var dependencies = require('../../../site/package.json').devDependencies;
  if (dependencies) {
    for (var i in dependencies) {
      srcs.push('!' + pomy + 'site/node_modules/' + i + '/**/*');
    }
  }

  // var dependencies = require('../../../package.json').dependencies;
  // if (dependencies) {
  // 	for (var i in dependencies) {
  // 		srcs.push(pomy + 'node_modules/' + i + '/**/*');
  // 		var subdeps = require('../../../node_modules/' + i + "/package.json").dependencies;
  // 		for (var j in subdeps) {
  // 			srcs.push(pomy + 'node_modules/' + j + '/**/*');
  // 		}
  // 	}
  // }

  return gulp.src(srcs, {
      base: pomy
    })
    .pipe(gulp.dest(root + target.root));
});