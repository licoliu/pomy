'use strict';

var path = require('path');

module.exports = {
  "md": function(name) {
    return /(\.(md)$)/i.test(path.extname(name));
  },
  "css": function(name) {
    return /(\.(css|scss|sass|less)$)/i.test(path.extname(name));
  },
  "html": function(name) {
    return /(\.(html|htm|ejs)$)/i.test(path.extname(name));
  },
  "image": function(name) {
    return /(\.(png|gif|jpeg|jpg)$)/i.test(path.extname(name));
  },
  "script": function(name) {
    return /(\.(js|coffee)$)/i.test(path.extname(name));
  },
  "json": function(name) {
    return /(\.(json)$)/i.test(path.extname(name));
  },
  "xml": function(name) {
    return /(\.(xml)$)/i.test(path.extname(name));
  }
};