'use strict';

/**
 *    Documents Service.
 */

module.exports =
  angular
  .module('diDocuments.service', ['diDocuments.sheet'])
  .service('documentsService', function($rootScope, $resource, $http, $q, $location, Sheet, diNotify) {

    var service = {
      currentDocument: {},
      files: [],

      getItem: getItem,
      getItemById: getItemById,
      getItemByIndex: getItemByIndex,
      getParentById: getParentById,
      addItem: addItem,
      removeItem: removeItem,
      createItem: createItem,
      size: size,
      getItems: getItems,
      removeItems: removeItems,
      renameItem: renameItem,
      setCurrentDocument: setCurrentDocument,
      getCurrentDocument: getCurrentDocument,
      setCurrentDocumentName: setCurrentDocumentName,
      getCurrentDocumentName: getCurrentDocumentName,
      setCurrentDocumentTitle: setCurrentDocumentTitle,
      getCurrentDocumentTitle: getCurrentDocumentTitle,
      setCurrentDocumentBody: setCurrentDocumentBody,
      getCurrentDocumentBody: getCurrentDocumentBody,
      setCurrentDocumentSHA: setCurrentDocumentSHA,
      getCurrentDocumentSHA: getCurrentDocumentSHA,
      save: save,
      init: init,

      query: query,
      resource: $resource('/markdown/documents/:id/', {
        id: '@id'
      }, {
        'save': {
          method: 'PUT'
        },
        'update': {
          method: 'POST'
        },
        'rename': {
          method: 'PUT',
          url: '/markdown/documents/:id/rename'
        },
        'del': {
          method: 'POST',
          url: '/markdown/documents/:id/del'
        }
      })
    };

    service.init();

    return service;

    //////////////////////////////

    /**
     *    Get item from the files array.
     *
     *    @param  {Object}  item  The actual item.
     */
    function getItem(item) {
      return item && item.id ? service.resource.get({
        id: item.id
      }) : null;
    }

    function getItemById(id, items) {
      var item = null;

      items = items || service.files;
      for (var i = 0, len = items.length; i < len; i++) {
        var file = items[i];

        if (file.children && file.children.length > 0) {
          item = getItemById(id, file.children);
          if (item) {
            break;
          }
        } else {
          if (id == file.id) {
            item = file;
            break;
          }
        }
      }
      return item;
    }

    function getParentById(id, node) {
      var item = null;

      var items = node ? node.children : service.files;
      for (var i = 0, len = items.length; i < len; i++) {
        var file = items[i];

        if (file.children && file.children.length > 0) {
          item = getParentById(id, file);
          if (item) {
            break;
          }
        } else {
          if (id == file.id) {
            item = node;
            break;
          }
        }
      }
      return item;
    }
    /**
     *    Get item from the files array by index.
     *
     *    @param  {Integer}  index  The index number.
     */
    function getItemByIndex(items) {
      var tmp = null,
        file = null;
      items = items || service.files;

      for (var i = 0, len = items.length; i < len; i++) {
        file = items[i];
        if (!file.children) {
          tmp = file;
          break;
        } else {
          tmp = getItemByIndex(file.children || []);
          if (tmp) {
            break;
          }
        }
      }

      return tmp;
    }

    /**
     *    Add item to the files array.
     *
     *    @param  {Object}  item  The item to add.
     */
    function addItem(item, node) {
      return new service.resource(item).$save();
    }

    function renameItem(item) {
      return service.resource.rename({
        id: item.id
      }, item);
    }

    /**
     *    Remove item from the files array.
     *
     *    @param  {Object}  item  The item to remove.
     */
    function removeItem(item) {
      item = new service.resource(item);
      return item.$remove().then(function() {
        var pi = getParentById(item.id);
        if (pi) {
          for (var i = 0, len = pi.children.length; i < len; i++) {
            if (pi.children[i].id == item.id) {
              return pi.children.splice(i, 1);
            }
          }
        }
      });
    }

    /**
     *    Creates a new document item.
     *
     *    @param  {Object}  props  Item properties (`title`, `body`, `id`).
     */
    function createItem(props) {
      return new Sheet(props);
    }

    /**
     *    Get the files array length.
     */
    function size() {
      return service.files.length;
    }

    /**
     *    Get all files.
     */
    function getItems() {
      return service.files;
    }

    /**
     *    Remove all items frm the files array.
     */
    function removeItems() {
      service.files = [];
      service.currentDocument = {};
      return false;
    }

    /**
     *    Update the current document.
     *
     *    @param  {Object}  item  The document object.
     *                            Must have a `title`, `body` and `id` property
     *                            to work.
     */
    function setCurrentDocument(item) {
      service.currentDocument = item;
      $location.search("id", item.id);
      return item;
    }

    /**
     *    Get the current document.
     */
    function getCurrentDocument() {
      return service.currentDocument;
    }

    /**
     *    Update the current document title.
     *
     *    @param  {String}  title  The document title.
     */
    function setCurrentDocumentName(name) {
      service.currentDocument.name = name;
      return name;
    }

    /**
     *    Get the current document title.
     */
    function getCurrentDocumentName() {
      return service.currentDocument.name;
    }

    /**
     *    Update the current document title.
     *
     *    @param  {String}  title  The document title.
     */
    function setCurrentDocumentTitle(title) {
      service.currentDocument.title = title;
      return title;
    }

    /**
     *    Get the current document title.
     */
    function getCurrentDocumentTitle() {
      return service.currentDocument.title;
    }

    /**
     *    Update the current document body.
     *
     *    @param  {String}  body  The document body.
     */
    function setCurrentDocumentBody(body) {
      service.currentDocument.body = body;
      return body;
    }

    /**
     *    Get the current document body.
     */
    function getCurrentDocumentBody() {
      service.setCurrentDocumentBody($rootScope.editor.getSession().getValue());
      return service.currentDocument.body;
    }

    /**
     *    Update the current document SHA.
     *
     *    @param  {String}  sha  The document SHA.
     */
    function setCurrentDocumentSHA(sha) {
      service.currentDocument.github.sha = sha;
      return sha;
    }

    /**
     *    Get the current document SHA.
     */
    function getCurrentDocumentSHA() {
      return service.currentDocument.github.sha;
    }

    function save(manual) {
      if (!angular.isDefined(manual)) {
        manual = false;
      }

      if (manual) {
        diNotify('Documents Saved.');
      }

      if (service.currentDocument.id) {
        service.resource.update({
          id: service.currentDocument.id
        }, service.currentDocument);
      }

      return localStorage.setItem('currentDocument', angular.toJson(service.currentDocument));
    }

    function query() {
      return service.resource.query();
    }

    function init() {
      service.files = service.query();
      service.files.$promise.then(function() {
        var item, _ref;
        if (!((_ref = service.files) != null ? _ref.length : void 0)) {
          item = this.createItem();
          this.addItem(item).then(function(item) {
            service.files.push(item);
            this.setCurrentDocument(item);
            return this.save();
          });
        } else {
          var currentDocument = null;

          var currentDocument = $location.search();
          if (!currentDocument.id) {
            currentDocument = angular.fromJson(localStorage.getItem('currentDocument'));
          }

          if (currentDocument && currentDocument.id) {
            currentDocument = service.getItemById(currentDocument.id)
          } else {
            currentDocument = service.getItemByIndex(0);
          }

          service.setCurrentDocument(currentDocument || {});
        }
      });
    }

  });