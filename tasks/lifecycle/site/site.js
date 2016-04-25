'use strict';

var
  gulp = require('gulp');

gulp.task('site', ['pre-site'], function() {

  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  var srcs = [
    root + 'package.json',
    root + 'pomy.json',

    pomy + 'util/**/*',

    pomy + 'site/public/**/*',
    pomy + 'site/routes/**/*',
    pomy + 'site/views/**/*',
    pomy + 'site/startup.js',
    pomy + 'site/package.json',
    pomy + 'site/plugins/**/*',
    pomy + 'site/README.md',
    pomy + 'site/node_modules/**/*',

    '!' + pomy + 'site/plugins/**/node_modules/**/*',
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
    .pipe(gulp.dest(root + global.settings.target.root));
});