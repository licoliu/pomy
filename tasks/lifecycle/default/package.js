'use strict';

var
    gulp = require('gulp'),
    zip = require('gulp-zip'),
    name = global.settings.name,
    version = global.settings.version,
    settings = global.settings,
    target = settings.target;

gulp.task('package', ['prepare-package'], function() {
    return gulp.src(target.classes + "/**/*")
        .pipe(zip(name + "@" + version + '.zip'))
        .pipe(gulp.dest(target.root));
});