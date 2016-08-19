var path = require('path'),
  request = require('request'),
  qs = require('querystring'),
  fs = require('fs'),
  folderDetect = require('../../../../util/folder-detect'),
  filters = require('../../../../util/filters'),
  Dropbox = require(path.resolve(__dirname, '../plugins/dropbox/dropbox.js')).Dropbox,
  Github = require(path.resolve(__dirname, '../plugins/github/github.js')).Github,
  GoogleDrive = require('../plugins/googledrive/googledrive.js').GoogleDrive,
  OneDrive = require('../plugins/onedrive/onedrive.js').OneDrive;

var folder = path.join(
  process.env.HOME,
  "var/" + global.settings.deploy[global.settings.target].domain + "/documents/" + global.settings.name + "/" + global.settings.target
);

// Show the index page
exports.index = function(req, res) {

  // Some flags to be set for client-side logic.
  var indexConfig = {
    isDropboxAuth: !!req.session.isDropboxSynced,
    isGithubAuth: !!req.session.isGithubSynced,
    isEvernoteAuth: !!req.session.isEvernoteSynced,
    isGoogleDriveAuth: !!req.session.isGoogleDriveSynced,
    isOneDriveAuth: !!req.session.isOneDriveSynced,
    isDropboxConfigured: Dropbox.isConfigured,
    isGithubConfigured: Github.isConfigured,
    isGoogleDriveConfigured: GoogleDrive.isConfigured,
    isOneDriveConfigured: OneDrive.isConfigured
  };

  if (!req.session.isEvernoteSynced) {
    console.warn('Evernote not implemented yet.');
  }

  if (req.session.github && req.session.github.username) {
    indexConfig.github_username = req.session.github.username;
  }
  return res.render('markdown/index', indexConfig);

};

exports.getDocuments = function(req, res) {
  var type = req.query.type;
  var position = type ? path.join(folder, type) : folder;
  return res.json(folderDetect.detectAllSync(position, filters.md, function(dir) {
    dir.title = path.relative(position, dir.title);
  }).children);
}

exports.getDocument = function(req, res) {
  var pathname = folderDetect.getSync(req.params.id, folder, filters.md);
  var file = null;
  if (pathname) {
    var stat = fs.statSync(pathname);
    var body = fs.readFileSync(pathname, 'utf8');
    file = {
      id: stat.ino,
      name: path.basename(pathname),
      title: path.relative(folder, pathname),
      body: body.toString()
    };
  }
  return res.json(file);
}

exports.renameDocument = function(req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var title = req.body.title;

  var pathname = folderDetect.getSync(id, folder, filters.md);
  fs.renameSync(pathname, path.join(folder, title, '..', name));

  return res.json({
    id: id
  });
}

exports.updateDocument = function(req, res) {
  var id = req.params.id;
  var body = req.body.body;

  var pathname = folderDetect.getSync(id, folder, filters.md);
  fs.writeFileSync(pathname, body, {
    flags: 'a'
  });

  return res.json({
    id: id
  });
}

exports.saveDocument = function(req, res) {
  var title = req.body.title;
  var name = req.body.name;
  var body = req.body.body;

  var pathname = path.join(folder, title, name);

  var filename = name;
  if (fs.existsSync(pathname)) {
    var i = 1;
    filename = name.replace(".md", "(" + i++ + ").md");
    var tmp = path.resolve(pathname, '..', filename);
    while (fs.existsSync(tmp)) {
      filename = name.replace(".md", "(" + i++ + ").md");
      tmp = path.resolve(pathname, '..', filename);
    }
    pathname = tmp;
  }

  fs.writeFileSync(pathname, body, {
    flags: 'a'
  });
  // fs.closeSync(fd);

  var stat = fs.statSync(pathname);
  return res.json({
    id: stat.ino,
    name: filename,
    title: path.relative(folder, pathname),
    body: body
  });
}
exports.delDocument = function(req, res) {
  var pathname = folderDetect.getSync(req.params.id, folder, filters.md);

  if (fs.existsSync(pathname)) {
    fs.unlinkSync(pathname);
  }
  return res.json({
    id: req.params.id
  });
}

// Show the not implemented yet page
exports.not_implemented = function(req, res) {
  return res.render('not-implemented');
};