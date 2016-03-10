'use strict';

var
    gulp = require('gulp'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn;

gulp.task('doc', function(cb) {

    var command = '../../node_modules/.bin/jsdoc';

    var jsdoc = spawn(command, [
        '-c', '.jsdoc'
    ], {
        cwd: '.'
    });

    jsdoc.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    jsdoc.stderr.on('data', function(data) {
        console.error(data.toString());
    });

    jsdoc.on('exit', function(code) {
        console.log('Finish jsdoc process');
        cb();
    });
});