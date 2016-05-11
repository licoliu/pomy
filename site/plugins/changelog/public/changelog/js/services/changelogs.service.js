'use strict';

module.exports =
  angular
  .module('diChangelogs.service', [])
  .service('changelogsService', function($rootScope, $http, $q, $location) {
    return {

      getChangelogs: function() {
        var defer = $q.defer();

        var values = [];
        values.$promise = defer.promise;
        values.$resolved = false;

        $http({
          method: 'GET',
          url: '/changelogs'
        }).success(function(data) {
          values.$resolved = true;

          data.sort(function(a, b) {
            return a.name < b.name ? 1 : -1;
          });

          angular.extend(values, data);
          defer.resolve(values);
        }).error(function(data) {
          values.$resolved = true;
          defer.reject(values);
        });
        return values;
      },

      getChangelog: function(id) {
        var defer = $q.defer();

        var values = {};
        values.$promise = defer.promise;
        values.$resolved = false;

        $http({
          method: 'POST',
          url: '/markdown/factory/fetch_html_direct',
          data: {
            id: id
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