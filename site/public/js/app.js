'use strict';

(function(window, document) {

  var angular;

  // jQuery
  window.jQuery = require('jquery');

  // AngularJS
  angular = require('exports?angular!angular');

  // Angular Bootstrap UI
  require('angular-bootstrap');
  require('angular-resource/angular-resource');

  require('./services/documents.service');
  // Base
  require('./base/base.controller');

  require('./components/teammember-modal.service');
  require('./components/teammember-modal.controller');

  // Configure Dependencies
  angular.module('POMY', [
    'pomyBase',
    'ui.bootstrap',
    'diDocuments.service',
    'ngResource'
  ]);

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