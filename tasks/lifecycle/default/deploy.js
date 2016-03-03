'use strict';

var
	gulp = require('gulp');

gulp.task('deploy', ['install'], function(cb) {
	//TODO注册到bower
	console.log("###################################################");
	console.log("############# gulp deploy finished. ###############");
	console.log("###################################################");
	cb();
});