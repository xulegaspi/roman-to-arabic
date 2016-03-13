'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'roman_to_arabic'
  });
}])

.controller('roman_to_arabic', roman_to_arabic);

function roman_to_arabic ( $scope, $http, $rootScope ) {

    $scope.checked = true;

    $scope.check = function(val) {
        check(val, $scope);
    };

    $scope.submit = function() {
        var data = JSON.stringify({
            data: $scope.roman
        });
        $http.post("/roman_to_arabic", data).success(function(data, status) {
            //console.log("SUCCESS: " + data);
            $scope.answer = data;

            $http.post("/update", "").success(function(data, status) {
                $rootScope.recent = data;
            });

        });

    }
}

// Check if the input value is valid
function check (val, $scope) {
    if(val) {
        var	str = val.toUpperCase(),
            validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
            token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
            key = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
            num = 0, m;
        if (!(str && validator.test(str))) {
            //console.log("ERROR");
            $scope.checked = false;
            $scope.valid = "Your Roman numeral contains an error.";
        } else {
            if(str.length > 21) {
                $scope.checked = false;
                $scope.valid = "Your Roman numeral is too big.";
            } else {
                //console.log("VALID");
                //console.log(str.length);
                $scope.checked = true;
                $scope.valid = "";
            }
        }
    } else {
        $scope.valid = "";
    }
}