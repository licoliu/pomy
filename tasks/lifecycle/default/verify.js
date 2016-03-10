'use strict';

var
    gulp = require('gulp');

gulp.task('verify', ['post-integration-test'], function(cb) {
    cb();
});