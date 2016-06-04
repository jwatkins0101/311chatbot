'use strict';

angular.module('311WebApp')
.controller('mainCtrl', function($scope, msgService) {

   $scope.attachMsg = function() {
     msgService.getResponse(query);
   };
});
