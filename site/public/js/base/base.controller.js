'use strict';

module.exports =
  angular
  .module('pomyBase', [
    'pomyBase.controllers.about'
  ])
  .controller('Base', function($scope, $timeout, $rootScope, $modal, documentsService) {
    $scope.showAbout = function(e) {
      e.preventDefault();
      $modal.open({
        template: require('raw!../components/teammember-modal.directive.html'),
        controller: 'TeamMemberModalInstance',
        windowClass: 'modal--dillinger about'
      });

      return false;
    };

    $scope.getApi = function(path) {
      window.frames[0].frames[1].location.href = "/docs/jsdoc/" + path;
    };

    $scope.limitTo1 = 7;
    $scope.more1 = function() {
      $scope.limitTo1 = 2 * $scope.limitTo1;
    };

    $scope.limitTo2 = 7;
    $scope.more2 = function() {
      $scope.limitTo2 = 2 * $scope.limitTo2;
    };

    $scope.limitTo3 = 7;
    $scope.more3 = function() {
      $scope.limitTo3 = 2 * $scope.limitTo3;
    };

    $scope.sprints = documentsService.getSprints();
    $scope.backlogs = documentsService.getBacklogs();
    $scope.deployments = documentsService.getDeployments();

    $scope.readme = documentsService.getReadme();
    $scope.readme.$promise.then(function() {
      if (!$scope.readme.error) {
        jQuery("p[name='readme']").html($scope.readme.data);
      }
    });
  });