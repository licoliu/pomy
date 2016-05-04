'use strict';

var
  fs = require('fs'),
  path = require('path');

module.exports = {

  detectSync: function(dir, callback) {
    var self = this;

    fs.readdirSync(dir).forEach(function(file) {
      var pathname = path.join(dir, file);
      if (fs.statSync(pathname).isDirectory()) {
        self.detectSync(pathname, callback);
      } else {
        if (callback) {
          callback(pathname);
        }
      }
    });
  },

  detectAllSync: function(directory, filter, callback) {
    var self = this;

    var dirs = {
      children: []
    };

    fs.readdirSync(directory).forEach(function(file) {
      var dir = null;
      var pathname = path.join(directory, file);
      var stat = fs.statSync(pathname);
      if (stat.isDirectory()) {
        dir = self.detectAllSync(pathname, filter, callback);
        dir.id = stat.ino; //stat.ctime.getTime();
        dir.name = file;
        dir.title = pathname;
        if (callback) {
          callback(dir, true);
        }
        dirs.children.push(dir);
      } else {
        dir = {
          id: stat.ino, //stat.ctime.getTime(),
          name: file,
          title: pathname
        };
        if (!filter || filter(file)) {
          dirs.children.push(dir);
          if (callback) {
            callback(dir, false);
          }
        }
      }
    });
    return dirs;
  },
  getSync: function(id, directory, filter) {
    var self = this;
    var dir = null;
    var dirs = fs.readdirSync(directory);

    for (var i = 0, len = dirs.length; i < len; i++) {
      var file = dirs[i];
      var pathname = path.join(directory, file);
      var stat = fs.statSync(pathname);
      if (stat.isDirectory()) {
        dir = self.getSync(id, pathname, filter);
        if (dir) {
          break;
        }
      } else {
        if ((!filter || filter(file)) && id == stat.ino) {
          dir = pathname;
          break;
        }
      }
    }
    return dir;
  },

  detect: function(dir, callback, finish) {
    var self = this;
    fs.readdir(dir, function(err, files) {
      (function next(i) {
        if (i < files.length) {
          var pathname = path.join(dir, files[i]);
          fs.stat(pathname, function(err, stats) {
            if (stats.isDirectory()) {
              self.detect(pathname, callback, function() {
                next(i + 1);
              });
            } else {
              if (callback) {
                callback(pathname);
              }
              next(i + 1);
            }
          });
        } else {
          if (finish) {
            finish();
          }
        }
      })(0);
    });
  }
};