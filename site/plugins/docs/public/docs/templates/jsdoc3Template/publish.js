var path = require('jsdoc/path');
var npath = require('path');

function resolveSourcePath(filepath) {
    var r = npath.resolve(process.cwd(), filepath);
    r = r.replace(process.cwd() + npath.sep, '');
    r = r.replace(npath.sep, '/');
    return r;
}


exports.publish = function(data, opts) {
    //	opts.destination = resolveSourcePath(opts.destination);
    //	opts.template = resolveSourcePath(opts.template);

    var myPublisher = require('./plugins/jd3t/myPublisher.js');

    console.log('Init jsdoc3Template');

    myPublisher.log.debugOn = true; // opts??
    myPublisher.publish(data, opts);
};