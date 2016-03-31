'use strict';

var
  connect = require('connect'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  methodOverride = require('method-override'),
  logger = require('morgan'),
  favicon = require('serve-favicon'),
  compress = require('compression'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  express = require('express'),
  serveStatic = require('serve-static'),
  errorHandler = require('errorhandler'),
  minimist = require('minimist'),

  routes = require('./routes'),
  markdownRoutes = require('./plugins/markdown/routes'),
  docsRoutes = require('./plugins/docs/routes'),
  core = require('./plugins/markdown/plugins/core/server.js'),
  dropbox = require('./plugins/markdown/plugins/dropbox/server.js'),
  github = require('./plugins/markdown/plugins/github/server.js'),
  googledrive = require('./plugins/markdown/plugins/googledrive/server.js'),
  onedrive = require('./plugins/markdown/plugins/onedrive/server.js'),

  config = require('config-file'),

  app = express();

var settings = null;

if (fs.existsSync(path.join(path.dirname(__filename), "../../../pomy.json"))) {
  settings = config(path.relative(
    process.cwd(),
    path.join(path.dirname(__filename), "../../../pomy.json")
  ));
} else {
  settings = config(path.relative(
    process.cwd(),
    path.join(path.dirname(__filename), "../pomy.json")
  ));
}

var argvs = minimist(process.argv.slice(2));

var domain = argvs.domain || settings.site.domain || 'localhost';
var port = argvs.port || settings.site.port || 8421;
var target = argvs.target || settings.target;
var debug = argvs.debug || settings.debug;

var configs = require('../package.json');
var version = configs.version;

var author = configs.authors.toString();
var keywords = configs.keywords;
var googleWebmasterMeta = configs.googleWebmasterMeta;
var title = configs.title;
var description = configs.description;

app.set('domain', domain)
app.set('port', port)

app.set('views', [path.join(__dirname, './views'),
  path.join(__dirname, './plugins/markdown/views'),
  path.join(__dirname, './plugins/docs/views')
])
app.set('view engine', 'ejs')

// May not need to use favicon if using nginx for serving
// static assets. Just comment it out below.
app.use(favicon(path.join(__dirname, './public/favicon.ico')))

if (debug) {
  app.use(logger('dev'))
} else {
  app.use(logger('short'))
}

app.use(compress())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(cookieParser('your secret here'))
app.use(cookieSession({
  name: 'surface-session',
  keys: ['open', 'source']
}))

// May not need to use serveStatic if using nginx for serving
// static assets. Just comment it out below.
app.use(serveStatic(path.join(__dirname, './public')))
app.use(serveStatic(path.join(__dirname, './plugins/markdown/public')))
app.use(serveStatic(path.join(__dirname, './plugins/docs/public')))

// Setup local variables to be available in the views.
app.locals.title = title;

app.locals.description = description;

app.locals.googleWebmasterMeta = googleWebmasterMeta;

app.locals.keywords = keywords;

app.locals.author = author;

app.locals.node_version = process.version.replace('v', '')
app.locals.app_version = version
app.locals.env = target

// At startup time so sync is ok.
app.locals.readme = fs.readFileSync(path.resolve(__dirname, './README.md'), 'utf-8')

if (debug) {
  app.use(errorHandler())
}

app.get('/', routes.index)
app.get('/markdown', markdownRoutes.index)
app.get('/api', docsRoutes.index)
app.get('/not-implemented', routes.not_implemented)

app.use(core)
app.use(dropbox)
app.use(github)
app.use(googledrive)
app.use(onedrive)

http.createServer(app).listen(app.get('port'), function createServerCb() {
  console.log('Express server listening on port ' + app.get('port'));
  console.log('\nhttp://' + app.get('domain') + ':' + app.get('port') + '\n');
})