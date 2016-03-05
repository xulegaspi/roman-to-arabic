'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'arabic_to_roman'
        });
    }])

    .controller('arabic_to_roman', arabic_to_roman);

function arabic_to_roman ( $scope, $http, $rootScope ) {

    $scope.checked = true;

    $scope.check = function(val) {
        if(val) {
            //console.log(val.toString().length);
            if(val.toString().length > 5) {
                $scope.valid = "The number you're trying to convert is too long.";
                $scope.checked = false;
            } else {
                $scope.valid = "";
                $scope.checked = true;
            }
        } else {
            $scope.valid = "";
            $scope.checked = true;
        }
    };

    $scope.submit = function() {
        var data = JSON.stringify({
            data: $scope.roman
        });
        $http.post("/arabic_to_roman", data).success(function(data, status) {
            //console.log("SUCCESS: " + data);
            $scope.answer = data;

            $http.post("/update", "").success(function(data, status) {
                $rootScope.recent = data;
            });
        });

        //console.log("hello");
    };
}
