//loading the 'login' angularJS module
var about = angular.module('about', []);
//defining the login controller
about.controller('aboutCtrl', function($scope, $http) {
    $scope.logout =function(){
    	console.log("I am logging out");
    	    $http ({
            method: "GET",
            url: "/loginpage",
            
        }).success(function (response) {
            
      		window.location.assign("/");
      		//console.log(response);
            
        }).error(function (response) {
            console.log("Promise not kept")
        });

    }

    
});






