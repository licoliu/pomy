var path = require('path'),
  request = require('request'),
  qs = require('querystring'),
  fs = require('fs'),
  moment = require('moment'),
  folderDetect = require('../../util/folder-detect'),
  filters = require('../../util/filters');

var folder = path.join(
  process.env.HOME,
  "var/" + global.settings.deploy[global.settings.target].domain + "/documents/" + global.settings.name + "/" + global.settings.target
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
  var domain = req.body.domain;
  var ips = req.body.ips;

  var dir = folder;
  if (global.settings.name !== name) {
    dir = path.join(
      process.env.HOME,
      "var/" + global.settings.deploy[global.settings.target].domain + "/documents/" + name + "/" + global.settings.target
    );
  }

  var pathname = path.join(dir, "deployments", target + ".md");

  var data = fs.existsSync(pathname) ? "" : "date|name|version|domain|ips\n-|:-:|:-:|:-:|-:\n";

  data += date + "|" + name + "|" + version + "|" + domain + "|" + ips + "\n";

  fs.appendFileSync(pathname, data, {
    flags: 'a'
  });

  return res.json({
    status: 'success'
  });
};

exports.getDeployments = function(req, res) {
  var position = path.join(folder, "deployments");

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

    var target = target.name.replace(/(.md)$/g, ""),
      owner = global.settings.owner;

    deployments.push({
      target: target,
      records: records,
      site: owner ? owner[target] : null
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