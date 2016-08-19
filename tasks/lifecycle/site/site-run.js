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

gulp.task('site:rerun', ['site:delete'], function(cb) {
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

gulp.task('site:delete', ['pom'], function(cb) {
  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    target = gutil.env.target || settings.target || 'local',
    dSite = settings.deploy[target] || {};

  var site = {
    user: gutil.env.user || dSite.user || 'root',
    ips: gutil.env.ips || dSite.ips || ['127.0.0.1'],
    sitePort: gutil.env.sitePort || dSite.sitePort || '8421',
    domain: gutil.env.domain || dSite.domain || 'localhost',
    nohup: gutil.env.nohup || dSite.nohup || false,
  };

  for (var i = 0, j = 0, len = 1 /*site.ips.length*/ ; i < len; i++) {

    var user = site.user;
    var ip = site.ips[i];
    var sitePort = site.sitePort;
    var nohup = site.nohup || false;
    var domain = site.domain;

    if (!user || !ip) {
      cb("请指定服务器地址和登录用户名。");
      return;
    }

    var remote = ip !== '127.0.0.1' && ip !== 'localhost';

    var command = "";
    if (process.platform === "win32") {
      command = "cmd /c ";
    }

    var ssh = user + "@" + ip;

    var opr = command;

    if (remote) {
      opr += " ssh " + ssh + " \"";
    }

    if (remote && nohup) {
      var dest = (user === "root" ? "/root" : "/home/" + user) + "/var/" + domain + "/";
      var folder = dest + name + ".site/current" /* version */ + "/site/";

      opr += " cd " + folder +
        " && ./node_modules/pm2/bin/pm2 delete " + name + ".site";
    } else {
      j++;
      if (j == len) {
        cb();
      }
      continue;
    }

    if (remote) {
      opr += "\"";
    }

    exec(opr, {}, function(err, stdout, stderr) {
      j++;
      console.log(stdout);
      // if (err) {
      // return cb(err);
      // }
      if (j == len) {
        cb();
      }
    });
  }
});

gulp.task('site:stop', ['pom'], function(cb) {
  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    target = gutil.env.target || settings.target || 'local',
    dSite = settings.deploy[target] || {};

  var site = {
    user: gutil.env.user || dSite.user || 'root',
    ips: gutil.env.ips || dSite.ips || ['127.0.0.1'],
    sitePort: gutil.env.sitePort || dSite.sitePort || '8421',
    domain: gutil.env.domain || dSite.domain || 'localhost',
    nohup: gutil.env.nohup || dSite.nohup || false,
  };

  for (var i = 0, j = 0, len = 1 /*site.ips.length*/ ; i < len; i++) {

    var user = site.user;
    var ip = site.ips[i];
    var sitePort = site.sitePort;
    var nohup = site.nohup || false;
    var domain = site.domain;

    if (!user || !ip) {
      cb("请指定服务器地址和登录用户名。");
      return;
    }

    var remote = ip !== '127.0.0.1' && ip !== 'localhost';

    var command = "";
    if (process.platform === "win32") {
      command = "cmd /c ";
    }

    var ssh = user + "@" + ip;

    var opr = command;

    if (remote) {
      opr += " ssh " + ssh + " \"";
    }

    if (remote && nohup) {
      var dest = (user === "root" ? "/root" : "/home/" + user) + "/var/" + domain + "/";
      var folder = dest + name + ".site/current" /* version */ + "/site/";

      opr += " cd " + folder +
        " && ./node_modules/pm2/bin/pm2 stop " + name + ".site";
    } else {
      // opr += "netstat -pan" +
      // " | grep " + sitePort + 
      // " | grep -v grep | grep LISTEN" +
      // " | awk '{print \\\$7}'" +
      // " | cut -d/ -f1" +
      // " | sed -e 's/^/kill -9 /g'" +
      // " | sh -";

      opr += "/usr/sbin/lsof -i tcp:" + sitePort +
        " | grep -v grep | grep LISTEN" +
        " | awk '{print " + (remote ? "\\\$2" : "$2") + "}'" +
        " | sed -e 's/^/kill -9 /g'" +
        " | sh -";
    }

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
    version = settings.version,
    debug = gutil.env.debug || settings.debug || false,
    target = gutil.env.target || settings.target || 'local',
    dSite = settings.deploy[target] || {};

  var site = {
    user: gutil.env.user || dSite.user || 'root',
    ips: gutil.env.ips || dSite.ips || ['127.0.0.1'],
    domain: gutil.env.domain || dSite.domain || 'localhost',
    sitePort: gutil.env.sitePort || dSite.sitePort || "8421",
    nohup: gutil.env.nohup || dSite.nohup || false,
  };

  for (var i = 0, j = 0, len = 1 /*site.ips.length*/ ; i < len; i++) {

    var user = site.user;
    var ip = site.ips[i];
    var sitePort = site.sitePort || '8421';
    var nohup = site.nohup || false;
    var domain = site.domain;

    if (!user || !ip) {
      cb("请指定服务器地址和登录用户名。");
      return;
    }

    var remote = ip !== '127.0.0.1' && ip !== 'localhost';

    if (!remote) {
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
      args.push(sitePort);
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
      var command = "";
      if (process.platform === "win32") {
        command = "cmd /c ";
      }

      var ssh = user + "@" + ip;
      var dest = (user === "root" ? "/root" : "/home/" + user) + "/var/" + domain + "/";
      var folder = dest + name + ".site/current" /* version */ + "/site/";

      var opr = command + " ssh " + ssh +
        " \"cd " + folder +
        " &&" +
        (nohup ?
          " ./node_modules/pm2/bin/pm2 start ./startup.json " + (debug ? "" : "--env production") :
          " node ./startup.js --ip " + ip + " --port " + sitePort + " --target " + target + " --debug " + debug) +
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