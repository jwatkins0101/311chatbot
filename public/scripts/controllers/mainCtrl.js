'use strict';

angular.module('311WebApp')
.controller('mainCtrl', function($scope, msgService) {

  $scope.messages = ["dummy message"];

  $scope.attachMsg = function(query) {
    $scope.messages.push('Me: ' + query);
    msgService.getResponse(query, function(resp) {
       $scope.messages.push('311Bot: ' + resp.data);
    });
  };
});
