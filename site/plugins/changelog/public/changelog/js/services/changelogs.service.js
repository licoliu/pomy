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
            if (typeof b === 'undefined' || b === null || typeof b.name === 'undefined' || b.name === null) {
              return -1;
            }

            if (typeof a === 'undefined' || a === null || typeof a.name === 'undefined' || a.name === null) {
              return 1;
            }

            var ans = a.name.split("."),
              bns = b.name.split("."),
              an = null,
              bn = null,
              aLen = ans.length,
              bLen = bns.length;
            for (var i = 0; i < aLen && i < bLen; i++) {
              if (ans[i] != bns[i]) {
                an = ans[i];
                bn = bns[i];

                if (!isNaN(an)) {
                  an = parseInt(an);
                }

                if (!isNaN(bn)) {
                  bn = parseInt(bn);
                }
                break;
              }
            }
            if (an == null || bn == null) {
              return aLen < bLen ? 1 : -1;
            }

            return an < bn ? 1 : -1;
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