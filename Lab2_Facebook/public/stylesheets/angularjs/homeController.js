//loading the 'login' angularJS module
var home = angular.module('home', ['ngRoute']);

home.config(function($routeProvider) {
    
    $routeProvider
    
        .when("/", {
            templateUrl: "views/main.html",
            controller: "mainCtrl"
        })
        .when("/friends", {
            templateUrl: "views/friends.html",
            controller: "friendsCtrl"
        })
        .when("/friends/:email",{
        templateUrl : "views/friendsInfo.html",
        controller: "friendsInfoCtrl"
        })
        .otherwise({
            redirectTo: "/errpage"
        });
});

home.controller("friendsCtrl", function($scope, $http) {
	$scope.name = "shruti";
    $http.get('/api/getMyFriends')
        .success(function(data) {
            $scope.friends = data;
            console.log("Got all friends");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
        
});

home.controller("mainCtrl", function($scope, $http) {
	$scope.name = "main";
        
});

home.controller("friendsInfoCtrl", function($scope, $http, $routeParams) {
	$scope.name = $routeParams.email;
	    $http.get('/api/getPersonInfo')
        .success(function(data) {
            $scope.friends = data;
            console.log("Got all friends");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});

home.controller("homeCtrl", function($scope, $http) {

});

//defining the login controller
home.controller('mainCtrl', function($scope, $http) {

    $scope.showFriendList = function() {
		window.location.assign("/friends");
    };
    
    $scope.searchFriends = function() {

        console.log("Searching for friend: " + $scope.searchQuery);
        var searchQuery = $scope.searchQuery;
        $http ({
            method: "GET",
            url: "/newfriends",
            params: {
                searchStr: searchQuery
            }
        }).success(function (data, status, headers, config) {
            
            if (data[0].statusCode === 401) {
                console.log("Promise kept, No friends found");
            } else {
                console.log("Search for: " + data[1].searchPattern);

                // Show friends on the new page.
                console.log("Promise kept, Found friends");
                window.location.assign("/showSearchResults/" + data[1].searchPattern);
            }
        }).error(function (response) {
            console.log("Promise not kept")
        });
    }
    
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
    
	$scope.showGroupsPage = function() {	
		window.location.assign("/showGroups");
    };
    
});




