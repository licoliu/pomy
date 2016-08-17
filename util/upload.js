'use strict';

var exec = require('child_process').exec;

module.exports = function(site, cwd, name, version, cb) {
  var user = site.user,
    domain = site.domain;
  for (var i = 0, j = 0, len = site.ips.length; i < len; i++) {
    var ip = site.ips[i];

    if (!user || !ip || ip === 'localhost' || ip === '127.0.0.1') {
      cb("请指定远程服务器和登录用户名。");
      return;
    }

    var ssh = user + "@" + ip;
    var dest = (user === "root" ? "/root" : "/home/" + user) + "/var/" + domain + "/";
    var zip = name /* + "@" + version */ + '.zip';

    var command = " ";
    if (process.platform === "win32") {
      command = "cmd /c ";
    }

    var folder = dest + name + "/" + version + "/";

    var opr = command + "ssh " + ssh + " \"mkdir -p " + dest + "\" ";

    opr += "&& " + command + "scp -r " + zip + " " + ssh + ":" + dest + " ";

    opr += "&& " + command + "ssh " + ssh + " \"mkdir -p " + folder + " && unzip -o " + dest + zip + " -d " + folder + "\"";

    exec(opr, {
      cwd: cwd,
      maxBuffer: 16000 * 1024
    }, function(err, stdout, stderr) {
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
};