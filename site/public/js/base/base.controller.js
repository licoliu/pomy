'use strict';

module.exports =
    angular
    .module('pomyBase', [
        'pomyBase.controllers.about'

    ])
    .controller('Base', function($scope, $timeout, $rootScope, $modal) {
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
    });