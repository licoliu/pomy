'use strict';

var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  spawn = require('child_process').spawn;

gulp.task('site:run', ['pom'], function(cb) {

  var domain = global.settings.site.domain || 'localhost';
  var port = global.settings.site.port || '';
  var target = global.settings.env.target || '';
  var debug = global.settings.debug || false;

  var startup = spawn('node', [
    "./startup",
    '--domain', domain,
    '--port', port,
    '--target', target,
    '--debug', debug
  ], {
    cwd: path.join(global.settings.cwd, './site/')
  });

  startup.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  startup.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  startup.on('exit', function(code) {
    console.log('site startup process exited with code ' + code);
    cb();
  });

});