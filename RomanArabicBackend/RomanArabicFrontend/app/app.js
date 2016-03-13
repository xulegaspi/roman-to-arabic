'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

// Controller for the tabs
app.controller('TabController', function ($http, $rootScope, $location) {
  if($location.path() == '/view2') {
    this.tab = 2;
  } else {
    this.tab = 1;
  }
  this.called = false;

  this.setTab = function (tabId) {
    this.tab = tabId;
    if(!this.called) {
      this.called = true;
      update();  // Get the "Recent conversions" data
    }
  };

  this.isSet = function (tabId) {
    if(!this.called) {
      this.called = true;
      update();  // Get the "Recent conversions" data
    }
    return this.tab === tabId;
  };

  function update() {
    $http.post("/update", "").success(function (data, status) {
      $rootScope.recent = [];
      for (var xx = 0; xx < data.length; xx++) {
        var str = data[xx].date + " \t " + data[xx].arabic + " = " + data[xx].roman;
        $rootScope.recent = data;
      }
    });
  }


});
