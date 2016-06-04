'use strict';

angular.module('311WebApp')
.service('msgService', function($http) {
  this.getResponse = function(query, callback) {
    $http.get('/api/chatResponse');
  };
});
