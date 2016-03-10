'use strict';

var
    gulp = require('gulp');

gulp.task('install', ['verify'], function(cb) {
    //TODO添加到本地bower cache
    console.log("###################################################");
    console.log("############# gulp install finished. ##############");
    console.log("###################################################");
    cb();
});