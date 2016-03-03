'use strict';

var
	gulp = require('gulp');

gulp.task('test', ['process-test-classes'], function(cb) {
	//TODO 自动化单元测试
	console.log("###################################################");
	console.log("############### gulp test finished. ###############");
	console.log("###################################################");
	cb();
});