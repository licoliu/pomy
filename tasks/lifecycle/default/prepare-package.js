'use strict';

var
	gulp = require('gulp'),
	exec = require('child_process').exec,
	src = global.settings.src,
	dest = global.settings.dest,
	testunit = global.settings.testunit,
	target = global.settings.target;

gulp.task('copy-jre', function() {
	var root = global.getRootPath();
	if (global.settings.debug) {
		return gulp.src([
				'!' + root + dest.rt + '/**/*',
				'!' + root + dest.rt,
				root + src.jre + '/**/*'
			], {
				base: root
			})
			.pipe(gulp.dest(root + target.classes));
	} else {
		return gulp.src([
				'!' + root + src.rt + '/**/*',
				'!' + root + src.rt,
				// '!' + root + testunit.jsrt + '/**/*',
				root + dest.jre + '/**/*'
			], {
				base: root
			})
			.pipe(gulp.dest(root + target.classes));
	}
});

gulp.task('copy-lib', function() {
	var root = global.getRootPath();
	return gulp.src([
			root + dest.lib + '/**/*'
		], {
			base: root
		})
		.pipe(gulp.dest(root + target.classes));
});

gulp.task('copy-classes', function() {
	var root = global.getRootPath();
	if (global.settings.debug) {
		return gulp.src([
				root + src.root + '/**/*'
			], {
				base: root
			})
			.pipe(gulp.dest(root + target.classes));
	} else {
		return gulp.src([
				root + dest.root + '/**/*'
			], {
				base: root
			})
			.pipe(gulp.dest(root + target.classes));
	}
});

gulp.task('copy-miscellaneous', function() {
	var root = global.getRootPath();
	return gulp.src([
			root + 'logo.ico',
			root + 'favicon.ico',
			root + 'index.html',
			root + 'pomy.json'
		])
		.pipe(gulp.dest(root + target.classes));
});

/* 将运行时前端文件拷贝至target
 *	1.jre, 
 *	2.lib, 
 *	3.classes,
 *	4.logo.ico, 
 *	5.index.html, 
 *	6.pomy.json
 */
gulp.task('prepare-package', ['test'], function(cb) {
	exec('gulp copy-jre copy-lib copy-classes copy-miscellaneous --process child', {
		cwd: global.settings.cwd
	}, function(err, stdout, stderr) {
		console.log(stdout);
		if (err) {
			return cb(err);
		}
		cb();
	});
});
