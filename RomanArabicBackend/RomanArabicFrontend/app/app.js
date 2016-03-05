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

app.controller('TabController', function ($http, $rootScope, $location) {
  //console.log($location.path());
  if($location.path() == '/view2') {
    this.tab = 2;
  } else {
    this.tab = 1;
  }
  $rootScope.right = '<span class="glyphicon glyphicon-arrow-right"></span>';
  $rootScope.left = '<span class="glyphicon glyphicon-arrow-left"></span>';
  this.called = false;

  this.setTab = function (tabId) {
    this.tab = tabId;
    if(!this.called) {
      this.called = true;
      update();
    }
  };

  this.isSet = function (tabId) {
    if(!this.called) {
      this.called = true;
      update();
    }
    return this.tab === tabId;
  };

  function update() {
    $http.post("/update", "").success(function (data, status) {
      $rootScope.recent = [];
      for (var xx = 0; xx < data.length; xx++) {
        //console.log(data[xx].date + " " + data[xx].arabic + " = " + data[xx].roman);
        //console.log(data[xx]);
        var str = data[xx].date + " \t " + data[xx].arabic + " = " + data[xx].roman;
        $rootScope.recent = data;
        //$rootScope.recent.push(str);
      }
    });
  }


});
