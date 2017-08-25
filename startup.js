'use strict';

var
  connect = require('connect'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
  favicon = require('serve-favicon'),
  compress = require('compression'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session'),
  express = require('express'),
  exphbs = require('express-handlebars'),
  serveStatic = require('serve-static'),
  errorHandler = require('errorhandler'),
  minimist = require('minimist'),
  httpProxy = require("http-proxy-middleware"),
  config = require('config-file');

var app = express();

var cwd = process.cwd();
var rootPath = path.join(path.dirname(__filename), ".");
var pomyConfig = path.join(rootPath, "pomy.json");

if (!fs.existsSync(pomyConfig)) {
  gutil.log(chalk.red('No pomy config found.'));
  process.exit(1);
}

global.settings = config(path.relative(cwd, pomyConfig));

var argvs = minimist(process.argv.slice(2));

var name = global.settings.name;
var target = argvs.target || global.settings.target || 'local';
var debug = !!(argvs.debug || global.settings.debug);

global.settings.target = target;
global.settings.debug = debug;

var dSite = global.settings.deploy[target];
var ips = dSite.ips;

var ip = argvs.ip || (ips.length > 0 ? ips[0] : null) || '127.0.0.1';
var port = argvs.port || dSite.port || 8888;
var domain = argvs.domain || dSite.domain || ip || "localhost";

app.set('ip', ip)
app.set('port', port)
app.set('domain', domain)

var plugins = {},
  _plugins = global.settings.plugins,
  _plugin = null;
for (var i in _plugins) {
  _plugin = _plugins[i];
  plugins[_plugin.group + "." + _plugin.artifact] = _plugin;
}

/**
 * May not need to use serveStatic if using nginx for serving
 * static assets. Just comment it out below.
 */
app.use("/jre", serveStatic(path.join(__dirname, "jre")))
app.use("/lib", serveStatic(path.join(__dirname, "lib")))
app.use("/classes", serveStatic(path.join(__dirname, "classes")))
app.use("/src", serveStatic(path.join(__dirname, "src")))

/**
 * views
 */
app.set('views', __dirname)

/**
 * view engine: express-handlebars
 */
app.engine('html', exphbs({
  extname: '.html'
}));
app.set('view engine', 'html')

/**
 * May not need to use favicon if using nginx for serving
 * static assets. Just comment it out below.
 */
app.use(favicon(path.join(__dirname, './logo.ico')))

/**
 * morgan
 */
if (debug) {
  app.use(morgan('dev', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a'
    })
  }))
} else {
  var logDirectory = path.join(__dirname, 'logs')

  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // setup the logger
  app.use(morgan('common', {
    stream: rfs('access.log', {
      interval: '7d', // rotate daily
      path: logDirectory
    })
  }));
}

/**
 * compress
 */
app.use(compress())

/**
 * body parser
 */
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

/**
 * method override
 */
app.use(methodOverride())

/**
 * cookie parser, cookie session
 */
app.use(cookieParser('your secret here'))
app.use(cookieSession({
  name: 'surface-session',
  keys: ['open', 'source']
}))

/**
 * error handler
 */
if (debug) {
  app.use(errorHandler())
}

app.get('/', function(req, res) {
  return res.render('index', global.settings);
});

/**
 *  Allow-Origin
 */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

/**
 *  http-proxy
 */
if ("com.expressjs.express" in plugins) {
  var plugin = plugins["com.expressjs.express"],
    proxy = plugin.proxy;
  app.use(proxy.url, httpProxy({
    target: proxy.target,
    changeOrigin: proxy.changeOrigin !== false,
    onProxyReq: function(proxyReq, req, res) {
      proxyReq.setHeader(proxy.key, proxy.token);
    }
  }));
}

http.createServer(app).listen(app.get('port'), function createServerCb() {
  console.log('Express server listening on port ' + app.get('port'));
  console.log('\nhttp://' + app.get('domain') + ':' + app.get('port') + '\n');
})