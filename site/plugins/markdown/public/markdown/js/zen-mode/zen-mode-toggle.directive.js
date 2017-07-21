'use strict';

module.exports =
  angular
  .module('diZenMode.directives', [])
  .directive('toggleZenMode', function() {

    var directive;

    directive = {
      restrict: 'E',
      replace: true,
      controller: 'diZenMode',
      controllerAs: 'zenmode',
      scope: {
        view: '='
      },
      template: require('raw!./zen-mode-toggle.directive.html')
    };

    return directive;
  });