'use strict';

module.exports =
  angular
  .module('pomyBase.controllers.about', [])
  .service('TeamMemberService', function($rootScope, $http, $q, $location) {
    return {

      getTeamMembers: function(type) {
        var defer = $q.defer();

        var values = [];
        values.$promise = defer.promise;
        values.$resolved = false;

        $http({
          method: 'GET',
          url: '/authors'
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