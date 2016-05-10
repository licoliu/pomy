var path = require('path'),
  request = require('request'),
  qs = require('querystring'),
  fs = require('fs'),
  moment = require('moment'),
  folderDetect = require('../../util/folder-detect'),
  filters = require('../../util/filters');

var folder = path.join(
  process.env.HOME,
  "var/" + global.settings.site.domain + "/documents/" + global.settings.target
);

// Show the index page
exports.index = function(req, res) {
  return res.render('index', global.settings);
};

// Show the not implemented yet page
exports.not_implemented = function(req, res) {
  return res.render('not-implemented');
};

exports.deploy = function(req, res) {
  var name = req.body.name;
  var version = req.body.version;
  var target = req.body.target;
  var date = moment().format("ddd, MMM Do YYYY, h:mm:ss a"); //req.body.date;

  var pathname = path.join(folder, "deploy", target + ".md");

  var data = fs.existsSync(pathname) ? "" : "date|name|version\n-|:-:|-:\n";

  data += date + "|" + name + "|" + version + "\n";

  fs.appendFileSync(pathname, data, {
    flags: 'a'
  });

  return res.json({
    status: 'success'
  });
};

exports.getDeployments = function(req, res) {
  var position = path.join(folder, "deploy");

  var deployments = [];

  folderDetect.detectAllSync(position, filters.md, function(target) {

    var content = fs.readFileSync(target.title, {
      encoding: 'utf-8'
    });

    var records = [],
      lines = content.split("\n"),
      line = null;

    for (var i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
      if (i >= 2) {
        var record = line.split("|");
        if (record && record.length >= 3) {
          records.unshift({
            date: record[0],
            name: record[1],
            version: record[2]
          });
        }
      }
    }

    deployments.push({
      target: target.name.replace(/(.md)$/g, ""),
      records: records
    });
  }).children;

  return res.json(deployments);
};

exports.getAuthors = function(req, res) {

  var author = global.settings.author || "",
    developers = global.settings.developers || [],
    contributors = global.settings.contributors || [],
    organization = global.settings.organization || {};

  return res.json({
    developers: developers,
    contributors: contributors,
    organization: organization,
    author: author
  });
};