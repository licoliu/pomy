'use strict';

var
  gulp = require('gulp'),
  path = require('path'),
  gutil = require('gulp-util'),
  upload = require('../../../util/upload'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec;

gulp.task('deploy', ['install'], function(cb) {

  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    _target = settings._target,
    target = gutil.env.target || settings.target || 'local',
    debug = gutil.env.debug || settings.debug || false;

  var root = global.getRootPath();

  var cwd = path.join(root + _target.root + "/");

  var dSite = settings.deploy[target] || {},
    sSite = settings.site;

  var site = {
    user: gutil.env.user || dSite.user || 'root',
    domain: gutil.env.domain || dSite.domain || 'localhost',
    ips: gutil.env.ips || dSite.ips || ['127.0.0.1'],
    siteIps: gutil.env.siteIps || sSite.ips || ['127.0.0.1'],
    sitePort: gutil.env.sitePort || sSite.port || '8421',
    nohup: gutil.env.nohup || dSite.nohup || false,
    scp: gutil.env.scp || dSite.scp || false
  };

  var postRecord = function() {
    if (target != 'local') {
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
        "&domain=" + site.domain +
        "&ips=" + site.ips.join(",") +
        "\" http://" + site.siteIps[0] + ":" + site.sitePort + "/deploy";

      exec(opr, {}, function(err, stdout, stderr) {});
    }
  };

  //拷贝至特定的ip
  if (site.scp) {
    if (site.ips && site.ips.length > 0) {
      upload(site, cwd, name, version, function(err) {
        if (err) {
          cb(err);
        } else {
          //保存发布记录至site站点
          try {
            postRecord();
          } catch (err) {
            console.log(err.message);
          } finally {
            console.log("###################################################");
            console.log("############# pomy deploy finished. ###############");
            console.log("###################################################");
            cb();
          }

          // restart
          /*
          var command = "",
            args = [];

          if (process.platform === "win32") {
            command = "cmd";
            args.push("/c");
          } else {
            command = "node";
          }

          args.push(global.getCommandPath('gulp'))
          args.push("rerun");
          args.push('--process');
          args.push("child");

          var renew = spawn(command, args, {
            cwd: path.join(global.settings.cwd),
            stdio: 'inherit'
          });

          renew.on('close', function(code) {
            if (code !== 0) {
              console.log('site restart process exited with code: ' + code + ".");
              cb(code);
            } else {
              try {
                postRecord();
              } catch (err) {
                console.log(err.message);
              } finally {
                console.log("###################################################");
                console.log("############# gulp deploy finished. ###############");
                console.log("###################################################");
                cb();
              }
            }
          });
          */
        }
      });
    }
  } else {
    postRecord();
  }
});