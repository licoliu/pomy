'use strict';

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var util = require('util');
var argv = require('minimist')(process.argv.slice(2));
var rename = require('gulp-rename');
var jeditor = require("gulp-json-editor");

gulp.task('archetype:create', function() {
  var settings = global.settings;

  var dirs = [settings.target.root,

    settings.src.root,
    settings.src.main,
    settings.testunit.js,

    settings.src.fonts,
    settings.src.images,
    settings.src.css,
    settings.src.less,
    settings.src.scss,
    settings.src.sass,
    // settings.src.skin,
    settings.src.skins,
    settings.src.js,
    settings.src.template
  ];

  var root = global.getRootPath();
  var pomy = global.getPomyPath();

  for (var i = 0, len = dirs.length; i < len; i++) {
    var dir = dirs[i];
    if (!fs.existsSync(path.join(root, dir))) {
      fs.mkdirSync(dir);
    }
  }

  //--group=com.lico --artifact=工程名
  // argv.group
  // argv.artifact
  var params = util._extend({}, argv);
  delete params._;
  params.artifact = params.artifact || params.name || path.parse(path.resolve(root)).name;
  params.name = params.artifact;
  params.group = params.group || path.parse(path.resolve(root, "../")).name;

  var configPath = null;

  if (!fs.existsSync(path.join(root, "pomy.json"))) {
    configPath = pomy + "project.json";
  } else {
    configPath = root + "pomy.json";
  }

  return gulp.src(configPath)
    .pipe(jeditor(params))
    .pipe(rename("pomy.json"))
    .pipe(gulp.dest(root));
});

gulp.task('archetype:generate', ['archetype:create'], function(cb) {
  cb();
});