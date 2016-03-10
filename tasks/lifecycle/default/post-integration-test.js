'use strict';

var
    gulp = require('gulp');

gulp.task('post-integration-test', ['integration-test'], function(cb) {
    cb();
});