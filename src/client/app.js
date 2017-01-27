(function () {
  'use strict';
  var app = angular.module('urlShortener', ['ng']);
  var controllers = require('./controllers');
  var directives = require('./directives');
  for(let key in controllers) {
    if(controllers.hasOwnProperty(key)) {
      app.controller(key, controllers[key]);
    }
  }
  for(let key in directives) {
    if(directives.hasOwnProperty(key)) {
      app.directive(key, directives[key]);
    }
  }
})();
