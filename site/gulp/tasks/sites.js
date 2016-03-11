'use strict';

var
  gulp = require('gulp'),
  // sequence = require('run-sequence'),
  spawn = require('child_process').spawn;

gulp.task('markdown', function(cb) {
  var markdown = spawn('../../node_modules/.bin/gulp', [
    'build', '--prod'
  ], {
    cwd: './plugins/markdown/'
  });

  markdown.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  markdown.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  markdown.on('exit', function(code) {
    console.log('Finish markdown site build process');
    cb();
  });
});

gulp.task('docs', function(cb) {

  var docs = spawn('../../node_modules/.bin/gulp', [
    'build', '--prod'
  ], {
    cwd: './plugins/docs/'
  });

  docs.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  docs.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  docs.on('exit', function(code) {
    console.log('Finish docs site build process');
    cb();
  });
});

gulp.task('sites', ['docs', 'markdown']);