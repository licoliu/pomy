//http://10.32.22.116:8421

'use strict';

/**
 *    Documents Service.
 */

module.exports =
  angular
  .module('diDocuments.service', [])
  .service('documentsService', function($rootScope, $resource, $http, $q, $location) {
    return {
      getBacklogs: function() {
        return this.getDocuments("backlog");
      },

      getSprints: function() {
        return this.getDocuments("sprint");
      },

      getDocuments: function(type) {
        var defer = $q.defer();

        var values = [];
        values.$promise = defer.promise;
        values.$resolved = false;

        $http({
          method: 'GET',
          url: '/markdown/documents?type=' + type
        }).success(function(data) {
          values.$resolved = true;
          angular.extend(values, data);
          defer.resolve(values);
        }).error(function(data) {
          values.$resolved = true;
          defer.reject(values);
        });
        return values;
      },

      getDeployments: function() {
        var defer = $q.defer();

        var values = [];
        values.$promise = defer.promise;
        values.$resolved = false;

        $http({
          method: 'GET',
          url: '/deployments'
        }).success(function(data) {
          values.$resolved = true;
          angular.extend(values, data);
          defer.resolve(values);
        }).error(function(data) {
          values.$resolved = true;
          defer.reject(values);
        });
        return values;
      },

      getReadme: function() {
        var defer = $q.defer();

        var values = {};
        values.$promise = defer.promise;
        values.$resolved = false;

        $http({
          method: 'POST',
          url: '/markdown/factory/fetch_html_direct',
          data: {
            root: true,
            title: "README.md"
          }
        }).success(function(data) {
          values.$resolved = true;
          angular.extend(values, data);
          defer.resolve(values);
        }).error(function(data) {
          values.$resolved = true;
          defer.reject(values);
        });
        return values;
      }
    };
  });