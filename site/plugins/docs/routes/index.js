var path = require('path'),
    request = require('request'),
    qs = require('querystring'),
    config = require('config-file'),
    settings = config("./pomy.json");

// Show the index page
exports.index = function(req, res) {
    return res.render('docs/index', settings);
};

// Show the not implemented yet page
exports.not_implemented = function(req, res) {
    return res.render('not-implemented');
};