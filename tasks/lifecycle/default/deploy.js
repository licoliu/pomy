'use strict';

var
  gulp = require('gulp'),
  path = require('path'),
  gutil = require('gulp-util'),
  upload = require('../../../util/upload'),
  exec = require('child_process').exec;

gulp.task('deploy', ['install'], function(cb) {

  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    _target = settings._target,
    target = gutil.env.target || settings.env.target || settings.target || '',
    debug = gutil.env.debug || settings.debug || false;

  var root = global.getRootPath();

  var cwd = path.join(root + _target.root + "/");

  var site = {
    user: gutil.env.user || settings.site.user || 'root',
    domain: gutil.env.domain || settings.site.domain || 'localhost',
    ips: gutil.env.ips || settings.site.ips || ['127.0.0.1'],
    port: gutil.env.port || settings.site.port || '8421',
    nohup: gutil.env.nohup || settings.site.nohup || false,
    scp: gutil.env.scp || settings.site.scp || false
  };

  //拷贝至特定的ip
  if (site.scp) {
    upload(site, cwd, name, version, function(err) {
      if (err) {
        cb(err);
      } else {
        //保存发布记录至site站点
        for (var i = 0, j = 1, len = site.ips.length; i < len; i++) {
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
            "&ip=" + site.ips[i] +
            "\" http://" + site.ips[0] + ":" + port + "/deploy";

          try {
            if (!debug) {
              exec(opr, {}, function(err, stdout, stderr) {});
            }
          } catch (err) {
            console.log(err.message);
          } finally {
            j++;
            if (j == len) {
              console.log("###################################################");
              console.log("############# gulp deploy finished. ###############");
              console.log("###################################################");
              cb();
            }
          }
        }
      }
    });
  }
});