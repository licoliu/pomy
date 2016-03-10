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