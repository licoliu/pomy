'use strict';

var fullWebpackConfig = require('./webpack.config.js');

fullWebpackConfig.devtool = 'eval';
fullWebpackConfig.cache = true;

module.exports = function(config) {
  return config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'public/markdown/js/classes.all.js',
      'public/markdown/js/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'public/markdown/js/classes.all.js': ['webpack'],
      'public/markdown/js/**/*.spec.js': ['webpack']
    },
    webpack: fullWebpackConfig,
    webpackServer: {
      noInfo: true
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-webpack'
    ],
    singleRun: false
  });
};