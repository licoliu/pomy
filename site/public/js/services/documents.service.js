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

      getSprints: function() {
        var defer = $q.defer();

        var values = [];
        values.$promise = defer.promise;
        values.$resolved = false;

        $http({
          method: 'GET',
          url: '/markdown/documents?type=site'
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