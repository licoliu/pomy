'use strict';

(function(window, document) {

  var angular;

  // jQuery
  window.jQuery = require('jquery');

  // AngularJS
  angular = require('exports?angular!angular');

  // Angular Bootstrap UI
  require('angular-bootstrap');

  // Configure Dependencies
  angular.module('POMY', [
    'pomyBase',
    'ui.bootstrap'
  ]);

  angular
    .module('pomyBase', [])
    .controller('Base', function($scope, $timeout, $rootScope) {
      $scope.getApi = function(path) {
        window.frames[0].frames[1].location.href = "/docs/jsdoc/" + path;
      };
    });

  // Run!
  angular.bootstrap(document, ['POMY']);



  // Simple and works.
  return jQuery(window).on('load', function() {
    return jQuery('#loading').animate({
      opacity: 0
    }, 400, function() {
      return jQuery('#loading').hide();
    });
  });

})(window, document);



// function autoHeightFrame(frame, offset) {
//   if (document.getElementById) {
//     if (frame && !window.opera) {
//       if (frame.contentDocument && frame.contentDocument.body.offsetHeight) {
//         frame.height = frame.contentDocument.body.offsetHeight + offset;
//       } else if (frame.Document && frame.Document.body.scrollHeight) {
//         frame.height = frame.Document.body.scrollHeight + offset;
//       }
//     }
//   }
// }