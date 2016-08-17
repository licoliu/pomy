'use strict';

var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec;


gulp.task('site:restart', ['site:stop'], function(cb) {
  var command = "",
    args = [];

  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('gulp'))
  args.push("site:start");
  args.push('--process');
  args.push("child");

  var startup = spawn(command, args, {
    cwd: path.join(global.settings.cwd),
    stdio: 'inherit'
  });

  startup.on('close', function(code) {
    if (code !== 0) {
      console.log('site restart process exited with code: ' + code + ".");
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('site:stop', ['pom'], function(cb) {
  var settings = global.settings,
    name = settings.name,
    version = settings.version;

  var site = {
    user: gutil.env.user || 'root',
    ips: gutil.env.ips || ['127.0.0.1'],
    port: gutil.env.port || '8421'
  };

  for (var i = 0, j = 0, len = 1 /*site.ips.length*/ ; i < len; i++) {

    var user = site.user;
    var ip = site.ips[i];
    var port = site.port;

    if (!user || !ip) {
      cb("请指定服务器地址和登录用户名。");
      return;
    }

    var command = "";

    var ssh = user + "@" + ip;

    if (process.platform === "win32") {
      command = "cmd /c ";
    }

    var opr = "";

    var remote = ip !== '127.0.0.1' && ip !== 'localhost'
    if (remote) {
      opr += command + " ssh " + ssh + " \"";
    }

    // opr += "netstat -pan" +
    // " | grep " + port + 
    // " | grep -v grep | grep LISTEN" +
    // " | awk '{print \\\$7}'" +
    // " | cut -d/ -f1" +
    // " | sed -e 's/^/kill -9 /g'" +
    // " | sh -";

    opr += "/usr/sbin/lsof -i tcp:" + port +
      " | grep -v grep | grep LISTEN" +
      " | awk '{print " + (remote ? "\\\$2" : "$2") + "}'" +
      " | sed -e 's/^/kill -9 /g'" +
      " | sh -";

    if (remote) {
      opr += "\"";
    }

    exec(opr, {}, function(err, stdout, stderr) {
      j++;
      console.log(stdout);
      if (err) {
        return cb(err);
      }
      if (j == len) {
        cb();
      }
    });
  }
});

gulp.task('site:start', ['pom'], function(cb) {

  var settings = global.settings,
    name = settings.name,
    version = settings.version;

  var target = gutil.env.target || settings.env.target || settings.target || '';
  var debug = gutil.env.debug || settings.debug || false;

  var site = {
    user: gutil.env.user || settings.site.user || 'root',
    ips: gutil.env.ips || settings.site.ips || ['127.0.0.1'],
    domain: gutil.env.domain || settings.site.domain || 'localhost',
    port: gutil.env.port || settings.site.port || "8421",
    nohup: gutil.env.nohup || settings.site.nohup || false,
  };

  for (var i = 0, j = 0, len = 1 /*site.ips.length*/ ; i < len; i++) {

    var user = site.user;
    var ip = site.ips[i];
    var port = site.port || '8421';
    var nohup = site.nohup || false;
    var domain = site.domain;

    if (!user || !ip) {
      cb("请指定服务器地址和登录用户名。");
      return;
    }

    if (ip === 'localhost' || ip === '127.0.0.1') {
      var command = null,
        args = [];

      if (process.platform === "win32") {
        command = "cmd";
        args.push("/c");
        args.push("node");
      } else {
        command = "node";
      }

      args.push("./startup");
      args.push('--ip');
      args.push(ip);
      args.push('--port');
      args.push(port);
      args.push('--target');
      args.push(target);
      args.push('--debug');
      args.push(debug);

      var startup = spawn(command, args, {
        cwd: path.join(settings.cwd, './site/'),
        stdio: 'inherit'
      });

      startup.on('close', function(code) {
        if (code !== 0) {
          console.log('site startup process exited with code: ' + code + '.');
          cb(code);
        } else {
          cb();
        }
      });
    } else {
      var ssh = user + "@" + ip;
      var dest = (user === "root" ? "/root" : "/home/" + user) + "/var/" + domain + "/";

      var command = "";
      if (process.platform === "win32") {
        command = "cmd /c ";
      }

      var folder = dest + name + ".site/" + version + "/";

      var opr = command + " ssh " + ssh +
        " \"cd " + folder +
        " && " + (nohup ? "nohup" : "") +
        " node site/startup" +
        " --ip " + ip +
        " --port " + port +
        " --target " + target +
        " --debug " + debug +
        "\"";

      exec(opr, {
        maxBuffer: 16000 * 1024
      }, function(err, stdout, stderr) {
        j++;
        // console.log(stdout);
        if (err) {
          return cb(err);
        }
        if (j == len) {
          cb();
        }
      });
    }
  }
});

gulp.task('site:run', ['site:start'], function(cb) {
  cb();
});