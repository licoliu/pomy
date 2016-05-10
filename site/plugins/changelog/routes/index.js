var path = require('path'),
  request = require('request'),
  qs = require('querystring'),
  fs = require('fs'),
  moment = require('moment'),
  folderDetect = require('../../../../util/folder-detect'),
  filters = require('../../../../util/filters');

var folder = path.join(
  process.env.HOME,
  "var/" + global.settings.site.domain + "/documents/" + global.settings.name + "/" + global.settings.target
);

// Show the index page
exports.index = function(req, res) {
  return res.render('changelog/index', global.settings);
};

exports.getChangelogs = function(req, res) {

  var position = path.join(folder, "changelog");

  var changelogs = folderDetect.detectAllSync(position, filters.md, function(target) {
    target.mtime = moment(target.mtime).format("ddd, MMM Do YYYY, h:mm:ss a");
    target.name = target.name.replace(/(.md)$/g, "");
  }).children;

  return res.json(changelogs);
};