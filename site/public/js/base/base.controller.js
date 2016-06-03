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

    $scope.limitTo = 7;
    $scope.limitTos = {};
    $scope.getLimitTo = function(key) {
      return $scope.limitTos[key] = $scope.limitTos[key] || $scope.limitTo;
    };

    $scope.more = function(key) {
      $scope.limitTos[key] += $scope.limitTo;
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