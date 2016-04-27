var path = require('path'),
  request = require('request'),
  qs = require('querystring'),
  fs = require('fs'),
  config = require('config-file'),
  settings = config("./pomy.json");

var folder = path.join(
  process.env.HOME,
  "var/" + global.settings.site.domain + "/documents/" + global.settings.target
);

// Show the index page
exports.index = function(req, res) {
  return res.render('index', settings);
};

// Show the not implemented yet page
exports.not_implemented = function(req, res) {
  return res.render('not-implemented');
};

exports.deploy = function(req, res) {
  var name = req.body.name;
  var version = req.body.version;
  var target = req.body.target;
  var date = req.body.date;

  var pathname = path.join(folder, "deploy", target + ".md");

  var data = fs.existsSync(pathname) ? "" : "date|name|version\n-|:-:|-:\n";

  data += date + "|" + name + "|" + version + "\n";

  fs.appendFileSync(pathname, data, {
    flags: 'a'
  });

  return res.json({
    status: 'success'
  });
}