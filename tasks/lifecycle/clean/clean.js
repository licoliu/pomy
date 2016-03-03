'use strict';

var
    gulp = require('gulp'),
    del = require('del'),
    dest = global.settings.dest,
    // src = global.settings.src,
    target = global.settings.target;

gulp.task('clean', ['pre-clean'], function(cb) {
    var root = global.getRootPath();
    var pomy = global.getPomyPath();

    var error = del([
        root + dest.fonts + '/*',
        root + dest.images + '/*',
        root + dest.template + '/*',
        root + dest.css + '/*',
        root + dest.skin + '/*',
        // root + dest.jre + '/*',
        root + dest.jsrt + '/*',
        root + dest.lib + '/*',
        root + dest.js + '/*',

        // root + src.css + '/**/*.css',
        // root + src.skin + '/**/*.css',

        root + target.root + "/*",
    pomy + 'site/plugins/docs/public/docs/jsdoc/*'


    ], function(err, deletedFiles) {
        console.log("##################################################");
        console.log("############### gulp clean finished. #############");
        console.log("##################################################");
        cb(err);
    });
});
