'use strict';

var
  gulp = require('gulp'),
  path = require('path'),
  gutil = require('gulp-util'),
  upload = require('../../../util/upload'),
  spawn = require('child_process').spawn,
  settings = global.settings,
  name = settings.name,
  version = settings.version,
  target = settings._target;

gulp.task('site:deploy', ['post-site'], function(cb) {

  var root = global.getRootPath();

  var cwd = path.join(root + target.root + "/");

  var site = {
    user: gutil.env.user || settings.site.user || 'root',
    ips: gutil.env.ips || settings.site.ips || ['127.0.0.1'],
    domain: gutil.env.domain || settings.site.domain || 'localhost'
  };

  upload(site, cwd, name + ".site", version, function(err) {
    if (err) {
      cb(err);
    } else {
      var command = "",
        args = [];

      if (process.platform === "win32") {
        command = "cmd";
        args.push("/c");
      } else {
        command = "node";
      }

      args.push(global.getCommandPath('gulp'))
      args.push("site:rerun");
      args.push('--process');
      args.push("child");

      var renew = spawn(command, args, {
        cwd: path.join(global.settings.cwd),
        stdio: 'inherit'
      });

      renew.on('close', function(code) {
        if (code !== 0) {
          console.log('site renew process exited with code: ' + code + ".");
          cb(code);
        } else {
          console.log("###################################################");
          console.log("############# gulp deploy finished. ###############");
          console.log("###################################################");
          cb();
        }
      });
    }
  });
});