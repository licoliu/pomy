var path = require('path'),
  request = require('request'),
  qs = require('querystring'),
  fs = require('fs'),
  moment = require('moment'),
  folderDetect = require('../../../../util/folder-detect'),
  filters = require('../../../../util/filters');

var folder = path.join(
  process.env.HOME,
  // "var/" + global.settings.deploy[global.settings.target].domain + "/documents/" + global.settings.name + "/" + global.settings.target
  "var/" + (global.settings.site.domain || global.settings.site.ips[0] || "www") + "/documents/" + global.settings.name
);

// Show the index page
exports.index = function(req, res) {
  return res.render('changelog/index', global.settings);
};

exports.getChangelogs = function(req, res) {

  var position = path.join(folder, "changelogs");

  var changelogs = folderDetect.detectAllSync(position, filters.md, function(target) {
    target.mtime = moment(target.mtime).format("ddd, MMM DD YYYY, hh:mm:ss a Z");
    target.name = target.name.replace(/(.md)$/g, "");
  }).children;

  return res.json(changelogs);
};