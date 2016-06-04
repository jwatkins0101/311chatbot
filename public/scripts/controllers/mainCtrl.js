'use strict';

angular.module('311WebApp')
.controller('mainCtrl', function($scope, msgService) {

  $scope.messages = ["dummy message"];

  $scope.attachMsg = function(query) {
    $scope.messages.push(query);
    msgService.getResponse(query, function(resp) {
       $scope.messages.push(resp.data);
    });
  };
});
