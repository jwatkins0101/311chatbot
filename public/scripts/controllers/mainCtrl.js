'use strict';

angular.module('311WebApp')
.controller('mainCtrl', function(msgService) {

   $scope.attachMsg = funcion() {
     msgService.getResponse(query);
   };
});
