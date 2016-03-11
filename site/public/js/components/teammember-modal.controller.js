'use strict';

module.exports =
  angular
  .module('pomyBase.controllers.about', [])

.controller('TeamMemberModalInstance', function($scope, $modalInstance) {

  $scope.ok = function() {
    return $modalInstance.close();
  };

  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };

});