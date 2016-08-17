'use strict';

var
  gulp = require('gulp'),
  path = require('path'),
  gutil = require('gulp-util'),
  upload = require('../../../util/upload'),
  settings = global.settings,
  name = settings.name,
  version = settings.version,
  target = settings._target;

gulp.task('site:deploy', ['post-site'], function(cb) {

  var root = global.getRootPath();

  var cwd = path.join(root + target.root + "/");

  var site = {
    user: gutil.env.user || settings.site.user || 'root',
    ips: gutil.env.ips || settings.site.ips || ['127.0.0.1'],
    domain: gutil.env.domain || settings.site.domain || 'localhost'
  };

  upload(site, cwd, name + ".site", version, cb);
});