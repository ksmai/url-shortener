'use strict';

module.exports = {
  'urlShortenerController': ['$scope', '$http', function($scope, $http) {
    $scope.input = '';
    $scope.error = '';
    $scope.long = '';
    $scope.short = '';
    $scope.valid = false;
    $scope.pend = false;
    $scope.validate = function() {
      $scope.valid = require('../../util/url-reg-exp').test($scope.input);
    };
    $scope.submit = function() {
      $scope.pend = true;
      $http.get(`/api/new/${encodeURIComponent($scope.input)}`)
           .then(function(res) {
             $scope.short = `${window.location.origin}/api${res.data.url}`;
             $scope.long = res.config.url.match(/\/api\/new\/(.*)$/)[1];
             $scope.error = '';
             if(!$scope.long.match(/^\w+:\/\//)) {
               $scope.long = `http://${$scope.long}`;
             }
           },
           function(err) {
             $scope.error = err.error;
             $scope.long = '';
             $scope.short = '';
           })
           .then(function() {
             $scope.pend = false;
           });
    };
    $scope.enter = function(evt) {
      if(evt.which === 13 && $scope.valid && !$scope.pend) {
        $scope.submit();
      }
    };
  }]
};

