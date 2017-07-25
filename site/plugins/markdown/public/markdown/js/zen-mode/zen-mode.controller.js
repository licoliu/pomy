'use strict';
var md = require('md').md;
module.exports =
  angular
  .module('diZenMode', ['diZenMode.directives'])
  .controller('diZenMode', function($scope, $rootScope, $compile, documentsService) {

    var
      vm = this,
      template;

    vm.isZen = false;
    vm.zen = null;

    template = require('raw!./zen-mode.directive.html');

    vm.toggle = function() {

      var el, scope;

      vm.isZen = !vm.isZen;

      if (vm.isZen === true) {

        scope = $rootScope.$new();
        el = $compile(template)(scope);

        angular.element(document.body).append(el);

        scope.$close = function() {
          vm.isZen = !vm.isZen;
          if ($scope.view === 'edit') {
            documentsService.setCurrentDocumentBody(vm.zen.getSession().getValue());
            $rootScope.$emit('document.refresh');
          }
          el.remove();
          scope.$destroy();
          return false;
        };

        require('brace/mode/markdown');
        require('../documents/theme-dillinger');

        if ($scope.view === 'edit') {
          vm.zen = ace.edit('zen');
          vm.zen.getSession().setMode('ace/mode/markdown');
          vm.zen.setTheme('ace/theme/dillinger');
          vm.zen.getSession().setUseWrapMode(true);
          vm.zen.renderer.setShowGutter(false);
          vm.zen.setShowPrintMargin(false);
          vm.zen.getSession().setValue(documentsService.getCurrentDocumentBody());
        } else {
          document.getElementById('zen').innerHTML = '<div style="overflow-y: scroll;height: 100%;">' + md.render($rootScope.editor.getSession().getValue()) + '</div>';
        }
        el.addClass('on');
      }
      return false;
    };
  });