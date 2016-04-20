'use strict';
module.exports =
  angular
  .module('diDocuments', [
    'diDocuments.service',
    'diDocuments.export'
  ])
  .controller('Documents', function($scope, $timeout, $rootScope, userService, documentsService, debounce) {

    var vm = this;

    vm.status = {
      import: true,
      save: true,
      linkUnlink: true,
      document: false
    };

    $scope.profile = userService.profile;
    $scope.saveDocument = save;
    $scope.createDocument = createDocument;
    $scope.removeDocument = removeDocument;
    $scope.selectDocument = selectDocument;
    $scope.toggleDocument = toggleDocument;
    $scope.clickDocument = clickDocument;
    $scope.renameDocument = renameDocument;
    $scope.enterRenameDocument = enterRenameDocument;

    $rootScope.treeOptions = {
      nodeChildren: "children",
      isSelectable: function(node) {
        return !node.children && node.id !== $rootScope.currentDocument.id;
      },
      isLeaf: function(node) {
        return !node.children;
      }
    };

    $rootScope.documents = documentsService.getItems();
    $rootScope.expandedNodes = [];

    $rootScope.editor.on('change', debounce(doAutoSave, 2000));
    $rootScope.$on('autosave', doAutoSave);

    function save(manuel) {
      var item = documentsService.getCurrentDocument();
      item.body = $rootScope.editor.getSession().getValue();

      documentsService.setCurrentDocument(item);

      return documentsService.save(manuel);
    }

    function initDocument() {

      var item = documentsService.getCurrentDocument();

      if (item && item.id) {
        item = documentsService.getItem(item);
      } else {
        item = documentsService.getItemByIndex(0);
        if (item && item.id) {
          item = documentsService.getItem(item);
        }
      }

      if (item && item.$promise) {
        item.$promise.then(function() {
          documentsService.setCurrentDocument(item);
          var pi = documentsService.getParentById(item.id);
          if (pi) {
            pi.expanded = true;
            $rootScope.expandedNodes.push(pi);
          }
          $rootScope.$emit('document.refresh');
        });
      }
    }

    function travel(documents, callback) {
      var doc = null;
      for (var i = 0, len = documents.length; i < len; i++) {
        doc = documents[i];
        if (doc.children) {
          travel(doc.children, callback)
        } else {
          callback(doc);
        }
      }
    }

    function selectDocument(item) {
      travel($rootScope.documents, function(doc) {
        doc.mode = (doc.id == item.id) ? 1 : 0
      });

      $rootScope.currentDocument = item;
      item = documentsService.getItem(item);
      if (item) {
        item.$promise.then(function() {
          documentsService.setCurrentDocument(item);
          $rootScope.$emit('document.refresh');
        });
      }
    }

    function clickDocument(item) {
      if (!item.mode) {
        item.mode = 0;
      }

      if (item.mode >= 2) {
        item.mode = 1;
      }

      item.mode++;
    }

    function enterRenameDocument(node, $event) {
      if ($event.keyCode === 13) {
        renameDocument(node);
      }
    }

    function renameDocument(node) {
      var name = node.name,
        title = node.title;

      documentsService.renameItem(node).$promise.then(function() {
        node.mode = 0;
        documentsService.setCurrentDocumentName(name);
        documentsService.setCurrentDocumentTitle(title.replace(/\/[^]*.md$/g, '/' + name));
      });
    };

    function toggleDocument(node, expanded) {
      node.expanded = expanded;
    }

    function removeDocument(item) {
      documentsService.removeItem(item).then(function() {
        var next = documentsService.getItemByIndex(0);

        next = documentsService.getItem(next);

        if (next) {
          next.$promise.then(function() {
            documentsService.setCurrentDocument(next);
            return $rootScope.$emit('document.refresh');
          });
        } else {
          documentsService.setCurrentDocument({});
          return $rootScope.$emit('document.refresh');
        }
      });
    }

    function createDocument(node) {
      var item;

      item = documentsService.createItem({
        title: node.title
          // ,body: $rootScope.editor.getSession().getValue()
      });

      documentsService.addItem(item).then(function(item) {
        node.children.push(item);
        documentsService.setCurrentDocument(item);
        return $rootScope.$emit('document.refresh');
      });
    }

    function doAutoSave() {
      if ($scope.profile.enableAutoSave) {
        return save();
      }

      return false;
    }

    $scope.$on('$destroy', function() {
      vm = null;
      $scope = null;

      return false;
    });

    $rootScope.documents.$promise.then(function() {
      $rootScope.currentDocument = documentsService.getCurrentDocument();
      initDocument();
    });

  });