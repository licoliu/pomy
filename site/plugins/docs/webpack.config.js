'use strict';

var
    path = require('path'),
    webpack = require('webpack'),
    nodeModulesPath = path.join(__dirname, 'node_modules');

module.exports = {
    cache: true,
    entry: './public/docs/js/app.js',
    output: {
        path: path.join(__dirname, 'public/docs/js'),
        filename: 'classes.all.js'
    },
    module: {
        noParse: [],
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader',
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    resolve: {
        modulesDirectories: ['node_modules', 'plugins'],
        extensions: ['', '.webpack.js', '.web.js', '.js'],
        alias: {}
    },
    resolveLoader: {
        root: nodeModulesPath
    },
    plugins: [

    ]
};