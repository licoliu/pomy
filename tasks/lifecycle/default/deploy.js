'use strict';

var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  exec = require('child_process').exec;

gulp.task('deploy', ['install'], function(cb) {

  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    target = settings.target;

  var user = gutil.env.user || settings.site.user || 'root';
  var domain = gutil.env.domain || settings.site.domain || 'localhost';
  var port = gutil.env.port || settings.site.port || '8421';
  var nohup = gutil.env.nohup || settings.site.nohup || false;

  var target = gutil.env.target || settings.env.target || '';
  var debug = gutil.env.debug || settings.debug || false;

  //TODO注册到bower, npm, 或者特定的ip

  //保存发布记录至site站点
  var opr = null;

  if (process.platform === "win32") {
    opr = "cmd /c curl";
  } else {
    opr = "curl";
  }

  opr += " -d \"" +
    "name=" + name +
    "&version=" + version +
    "&target=" + target +
    "&date=" + new Date() +
    "\" http://" + domain + ":" + port + "/deploy";

  try {
    if (!debug) {
      exec(opr, {}, function(err, stdout, stderr) {});
    }
  } catch (err) {
    console.log(err.message);
  } finally {
    console.log("###################################################");
    console.log("############# gulp deploy finished. ###############");
    console.log("###################################################");
    cb();
  }
});