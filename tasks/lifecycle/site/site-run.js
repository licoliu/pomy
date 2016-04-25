'use strict';

var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec;

gulp.task('site:restart', ['site:stop'], function(cb) {
  exec(global.getCommandPath('gulp') + ' site:start --process child', {
    cwd: global.settings.cwd
  }, function(err, stdout, stderr) {
    console.log(stdout);
    if (err) {
      return cb(err);
    }
    cb();
  });
});

gulp.task('site:stop', ['pom'], function(cb) {
  var settings = global.settings,
    name = settings.name,
    version = settings.version,
    target = settings.target;

  var user = gutil.env.user || settings.site.user || 'root';
  var domain = gutil.env.domain || settings.site.domain || 'localhost';
  var port = gutil.env.port || settings.site.port || '8421';

  var command = "";

  var ssh = user + "@" + domain;

  if (process.platform === "win32") {
    command = "cmd /c ";
  }

  var opr = "";

  var remote = domain !== '127.0.0.1' && domain !== 'localhost'
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
    console.log(stdout);
    if (err) {
      return cb(err);
    }
    cb();
  });
});

gulp.task('site:start', ['pom'], function(cb) {

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

  if (domain === 'localhost' || domain === '127.0.0.1') {
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
    args.push('--domain');
    args.push(domain);
    args.push('--port');
    args.push(port);
    args.push('--target');
    args.push(target);
    args.push('--debug');
    args.push(debug);

    var startup = spawn(command, args, {
      cwd: path.join(settings.cwd, './site/')
    });

    startup.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    startup.stderr.on('data', function(data) {
      console.error(data.toString());
    });

    startup.on('exit', function(code) {
      console.log('site startup process exited with code ' + code);
      cb();
    });
  } else {
    var ssh = user + "@" + domain;
    var dest = "/home/" + user + "/var/" + domain + "/";
    var zip = name + ".site@" + version + '.zip';

    var command = "";
    if (process.platform === "win32") {
      command = "cmd /c ";
    }

    var folder = dest + name + ".site/" + version + "/";

    var opr = command + " ssh " + ssh +
      " \"cd " + folder +
      " && " + (nohup ? "nohup" : "") +
      " node site/startup" +
      " --domain " + domain +
      " --port " + port +
      " --target " + target +
      " --debug " + debug +
      "\"";

    exec(opr, {}, function(err, stdout, stderr) {
      console.log(stdout);
      if (err) {
        return cb(err);
      }
      cb();
    });
  }
});

gulp.task('site:run', ['site:start'], function(cb) {
  cb();
});