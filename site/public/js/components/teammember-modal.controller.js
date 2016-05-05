'use strict';

module.exports =
  angular
  .module('pomyBase.controllers.about')

.controller('TeamMemberModalInstance', function($scope, $modalInstance, TeamMemberService) {

  $scope.ok = function() {
    return $modalInstance.close();
  };

  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };

  $scope.teamMembers = TeamMemberService.getTeamMembers();

});