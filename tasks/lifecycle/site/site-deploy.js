'use strict';

var
  gulp = require('gulp'),
  path = require('path'),
  gutil = require('gulp-util'),
  exec = require('child_process').exec,
  settings = global.settings,
  name = settings.name,
  version = settings.version,
  target = settings.target;

gulp.task('site:deploy', ['post-site'], function(cb) {

  var user = gutil.env.user || settings.site.user,
    domain = gutil.env.domain || settings.site.domain;

  if (!user || !domain || domain === 'localhost' || domain === '127.0.0.1') {
    cb("请指定远程服务器和用户名密码。");
    return;
  }

  var root = global.getRootPath();

  var cwd = path.join(root + target.root + "/");

  var command = "";

  var ssh = user + "@" + domain;
  var dest = "/var/" + domain + "/";
  var zip = name + ".site@" + version + '.zip';

  if (process.platform === "win32") {
    command = "cmd /c ";
    dest = "/c:/users/" + user + dest;
  } else {
    dest = "/home/" + user + dest;
  }

  var folder = dest + name + ".site/" + version + "/";

  var opr = command + " ssh " + ssh + " \"mkdir -p " + dest + "\" ";

  opr += "&& " + command + "scp -r " + zip + " " + ssh + ":" + dest + " ";

  opr += "&& " + command + " ssh " + ssh + " \"mkdir -p " + folder + " && unzip -o " + dest + zip + " -d " + folder + "\"";

  exec(opr, {
    cwd: cwd,
    maxBuffer: 16000 * 1024
  }, function(err, stdout, stderr) {
    console.log(stdout);
    if (err) {
      return cb(err);
    }
    cb();
  });

});