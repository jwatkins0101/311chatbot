angular.module('311WebApp', []);

'use strict';

angular.module('311WebApp')
.controller('mainCtrl', function($scope, msgService) {

  $scope.messages = ["dummy message"];

  $scope.attachMsg = function(query) {
    $scope.messages.push('Me: ' + query);
    msgService.getResponse(query, function(resp) {
       $scope.messages.push(resp.data);
    });
  };
});

'use strict';

angular.module('311WebApp')
.service('msgService', function($http) {
  this.getResponse = function(query, callback) {
    $http.get('api/chat')
    .then(callback);
  };
});
