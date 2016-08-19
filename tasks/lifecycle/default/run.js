'use strict';

var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec;


gulp.task('restart', ['stop'], function(cb) {
  var command = "",
    args = [];

  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('gulp'))
  args.push("start");
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

gulp.task('rerun', ['delete'], function(cb) {
  var command = "",
    args = [];

  if (process.platform === "win32") {
    command = "cmd";
    args.push("/c");
  } else {
    command = "node";
  }

  args.push(global.getCommandPath('gulp'))
  args.push("start");
  args.push('--process');
  args.push("child");

  var startup = spawn(command, args, {
    cwd: path.join(global.settings.cwd),
    stdio: 'inherit'
  });

  startup.on('close', function(code) {
    if (code !== 0) {
      console.log('site renew process exited with code: ' + code + ".");
      cb(code);
    } else {
      cb();
    }
  });
});

gulp.task('delete', ['pom'], function(cb) {
  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    target = gutil.env.target || settings.target || 'local',
    dSite = settings.deploy[target] || {};

  var site = {
    user: gutil.env.user || dSite.user || 'root',
    ips: gutil.env.ips || dSite.ips || ['127.0.0.1'],
    port: gutil.env.port || dSite.port || '80',
    domain: gutil.env.domain || dSite.domain || 'localhost',
    nohup: gutil.env.nohup || dSite.nohup || false,
  };

  for (var i = 0, j = 0, len = 1 /*site.ips.length*/ ; i < len; i++) {

    var user = site.user;
    var ip = site.ips[i];
    var port = site.port;
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
      var folder = dest + name + "/current/" /* version + "/" */ ;

      opr += "cd " + folder +
        " && ./node_modules/pm2/bin/pm2 delete " + name;
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
      //   return cb(err);
      // }
      if (j == len) {
        cb();
      }
    });
  }
});

gulp.task('stop', ['pom'], function(cb) {
  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    target = gutil.env.target || settings.target || 'local',
    dSite = settings.deploy[target] || {};

  var site = {
    user: gutil.env.user || dSite.user || 'root',
    ips: gutil.env.ips || dSite.ips || ['127.0.0.1'],
    port: gutil.env.port || dSite.port || '80',
    domain: gutil.env.domain || dSite.domain || 'localhost',
    nohup: gutil.env.nohup || dSite.nohup || false,
  };

  for (var i = 0, j = 0, len = 1 /*site.ips.length*/ ; i < len; i++) {

    var user = site.user;
    var ip = site.ips[i];
    var port = site.port;
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
      var folder = dest + name + "/current/" /* version + "/" */ ;

      opr += "cd " + folder +
        " && ./node_modules/pm2/bin/pm2 stop " + name;
    } else {
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

gulp.task('start', ['pom'], function(cb) {

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
    port: gutil.env.port || dSite.port || "80",
    nohup: gutil.env.nohup || dSite.nohup || false,
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
      args.push(port);
      args.push('--target');
      args.push(target);
      args.push('--debug');
      args.push(debug);

      var startup = spawn(command, args, {
        cwd: path.resolve(global.getRootPath()),
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

      var folder = dest + name + "/current/" /* version + "/" */ ;

      var opr = command + " ssh " + ssh +
        " \"cd " + folder +
        " && " +
        (nohup ?
          " ./node_modules/pm2/bin/pm2 start ./startup.json " + (debug ? "" : "--env production") // --node-args \\\"ip='" + ip + "' port='" + port + "' target='" + target + "' debug=" + debug + "\\\"" :
          :
          " node ./startup.js --ip " + ip + " --port " + port + " --target " + target + " --debug " + debug) +
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

gulp.task('run', ['start'], function(cb) {
  cb();
});