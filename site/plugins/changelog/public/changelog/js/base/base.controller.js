'use strict';

module.exports =
  angular
  .module('pomyBase', ['pomyBase.controllers.about'])
  .controller('Base', function($scope, $timeout, $location, $rootScope, $modal, changelogsService) {
    $scope.showAbout = function(e) {
      e.preventDefault();
      $modal.open({
        template: require('raw!../../../../../../public/js/components/teammember-modal.directive.html'),
        controller: 'TeamMemberModalInstance',
        windowClass: 'modal--dillinger about'
      });

      return false;
    };

    $scope.limitTo = 7;
    $scope.more = function() {
      $scope.limitTo = 2 * $scope.limitTo;
    };

    $scope.autoExpand = function(callback) {
      var scrollTop = jQuery(document).scrollTop(),
        wHeight = jQuery(window).height(),
        nHeight = jQuery(".navbar").height();

      var readmes = jQuery("ul.readmes li.readme[expand!='true']"),
        length = readmes.length;

      var flag = 0;

      readmes.each(function(index, readme) {
        readme = jQuery(readme);

        var scope = angular.element(readme).scope().changelog,
          isExpand = scope.isExpand,
          top = readme.offset().top;

        if (!scope.isExpand && scope.status !== "loading" &&
          top - nHeight >= scrollTop && top - scrollTop <= wHeight) {
          var changelog = changelogsService.getChangelog(scope.id);
          changelog.$promise.then(function() {
            readme.find("p").append(changelog.data);
            scope.isExpand = true;
            scope.status = "success";

            if (readme.attr("last") === 'true') {
              $scope.more();
            }

            flag++;
            if (callback && flag === length) {
              callback();
            }
          }, function() {
            scope.status = "error";

            flag++;
            if (callback && flag === length) {
              callback();
            }
          });
          scope.status = "loading";
        } else {
          flag++;
          if (callback && flag === length) {
            callback();
          }
        }
      });

      if (callback && length === 0) {
        callback();
      }
    };

    $scope.changelogs = changelogsService.getChangelogs();
    $scope.changelogs.$promise.then(function() {
      $timeout(function() {
        $scope.autoExpand(function() {
          var params = $location.search();
          var versions = (params.version || "").split(".");
          while (versions.length > 0) {
            var readme = jQuery("ul.readmes li.readme[name='" + versions.join(".") + "']");
            if (readme.length > 0) {
              jQuery("html,body").animate({
                scrollTop: readme.first().offset().top - jQuery(".navbar").height()
              }, 1000);
              break;
            }
            versions.pop();
          }

        });
      }, 50, true, null);
    });

    jQuery(window).on("scroll", function() {
      $scope.autoExpand();
    });
  });