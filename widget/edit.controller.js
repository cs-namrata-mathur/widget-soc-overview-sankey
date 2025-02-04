/* Copyright start
  MIT License
  Copyright (c) 2023 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editSocOverviewSankey100Ctrl', editSocOverviewSankey100Ctrl);

  editSocOverviewSankey100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'appModulesService', 'Entity'];

  function editSocOverviewSankey100Ctrl($scope, $uibModalInstance, config, appModulesService, Entity) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.config = config;
    $scope.header = $scope.config.title ? 'Edit SOC Overview Sankey Chart' : 'Add SOC Overview Sankey Chart';
    $scope.params = {};
    $scope.fetchAttributes = fetchAttributes;
    $scope.setSourceJson = setSourceJson;
    $scope.config.sourceJson = !angular.isArray($scope.config.sourceJson) ? $scope.config.sourceJson : {};
    $scope.jsoneditorOptions = {
      name: 'Fields',
      mode: 'code',
      onEditable: function () {
        return {
          field: true,
          value: true
        };
      }
    };

    function loadModules() {
      appModulesService.load(true).then(function (modules) {
        $scope.modules = modules;
      });
      if ($scope.config.resource) {
        $scope.fetchAttributes('target');
      }
      if ($scope.config.relation) {
        $scope.fetchAttributes('relation');
      }
    }

    function fetchAttributes(forResource) {
      var resource = forResource === 'target' ? $scope.config.resource : $scope.config.relation;
      var entity = new Entity(resource);
      entity.loadFields().then(function () {
        $scope.params[forResource + 'Fields'] = entity.getFormFields();
        $scope.params[forResource + 'RelationshipFields'] = entity.getRelationshipFields();
        $scope.params[forResource + 'FieldsArray'] = entity.getFormFieldsArray();

        $scope.params[forResource + 'NodePicklistFields'] = _.filter($scope.params[forResource + 'FieldsArray'], function (field) {
          return field.type === 'picklist' && field.options;
        });
        if (forResource === 'target') {
          $scope.params.fields = $scope.params.targetFields;
          angular.extend($scope.params.fields, $scope.params.targetRelationshipFields);
          $scope.params.fieldsArray = $scope.params.targetFieldsArray;
          $scope.params.sourceNodeFields = _.filter($scope.params[forResource + 'FieldsArray'], function (field) {
            return field.type === 'text';
          });
        }
      });
    }

    function setSourceJson(json) {
      if (angular.isString(json)) {
        try {
          $scope.config.sourceJson = JSON.parse(json);
        } catch (e) {
          // invalid JSON. skip the rest
          return;
        }
      }
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      $uibModalInstance.close($scope.config);
    }

    loadModules();
  }
})();
