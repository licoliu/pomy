'use strict';

module.exports =
  angular
  .module('diDocuments.sheet', [])
  .factory('Sheet', function() {

    return function(sheetData) {

      angular.extend(this, {
        // id: new Date().getTime(),
        name: 'Untitled Document.md',
        title: '',
        body: require('raw!../../../../README.md')
      });

      return angular.extend(this, sheetData);
    };

  });