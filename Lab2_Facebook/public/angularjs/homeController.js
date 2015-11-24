//loading the 'login' angularJS module
var home = angular.module('home', ['ngRoute']);

home.service('sharedProperties', function () {
	var property = {
		data1: 'First',
		data2: 'Second',
		data3: 'Third',
		data4 : 'Fourth'
	}
	
	return {
		getProperty: function () {
			return property;
		},
		setProperty: function(value) {
			property = value;
		}
		};
});

home.config(function($routeProvider) {
    
    $routeProvider
    
        .when("/", {
            templateUrl: "views/main.html",
            controller: "homeCtrl"
        })
        .when("/friends", {
            templateUrl: "views/friends.html",
            controller: "friendsCtrl"
        })
        .when("/friends/:email",{
        	templateUrl : "views/friendsInfo.html",
        	controller: "friendsInfoCtrl"
        })
        .when("/search/:query",{
        	templateUrl : "/views/searchPeople.html",
        	controller : "searchPeopleCtrl"
        })
        .when("/addAsFriendResult",{
        	templateUrl :"/views/addAsFriend.html",
        	controller : "addAsFriendCtrl"
        })
        .when("/groups",{
        	templateUrl :"/views/groups.html",
        	controller : "groupCtrl"
        })
        .when("/groups/:groupId",{
       		templateUrl : "views/groupInfo.html",
        	controller: "groupInfoCtrl"
        })
        .otherwise({
            redirectTo: "/errpage"
        });
});

home.controller("friendsCtrl", function($scope, $http) {
	$scope.name = "David";
    $http.get('/api/getMyFriends')
        .success(function(data) {
            $scope.friends = data[0].friends;
            console.log(JSON.stringify(data));
            console.log(" - " + JSON.stringify(data[0].friends));
            $scope.friends = [
                              {
                            	  fname: "Pete",
                            	  lanme: "Mark"
                              }
                              ];
            console.log("Got all friends");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
        
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

home.controller("homeCtrl", function($scope, $http, $location) {

	        $http ({
            method: "GET",
            url: "/api/getNotifications",
            })
            .success(function(data) {
            	var notifs = data[0].notifs;
            console.log("Number of notifications found = "+notifs.length);
            $scope.notifs = notifs;
            $scope.notifs = ["Pete has accepted your friend request"]
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});

home.controller("searchPeopleCtrl", function($scope, $http, $routeParams, $location, sharedProperties) {

	$scope.query = $routeParams.query;
	        $http ({
            method: "GET",
            url: "/api/searchPeople",
            params: {
                searchStr: $scope.query
            }
            })
            .success(function(data) {
            console.log("Number of people found = "+data.length);
            $scope.people = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
                
        $scope.addAsFriend =function(p){
        	//Need to check if he is already a friend
        	//Not a friend so send a request
            //he is already my friend
            $scope.sharedData = sharedProperties.getProperty();
            $scope.sharedData.data1 = p.fname;
            $scope.sharedData.data2 = p.lname;
            //$scope.sharedData2 = sharedProperties.getProperty();
            $location.path("/addAsFriendResult");
           
        };
});

///hey there

//defining the login controller
home.controller('mainCtrl', function($scope, $http, $location) {

    //$scope.dataFromServer = $scope.data;
	//console.log($scope.dataFromServer.email);
	
	$scope.goNext = function(hash) {
	console.log("Going to the page "+hash);
		$location.path(hash);
	};

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


home.controller('addAsFriendCtrl', function($scope, $http, $location, sharedProperties) {

	$scope.x = sharedProperties.getProperty();
	$scope.message = $scope.x;
	$scope.id1 = $scope.x.data1;
	$scope.id2 = $scope.x.data2;
	//console.log("Id is: " +$scope.id);
	
	console.log("ID1: " + $scope.id1 + " ID2: " + $scope.id2 );
	
	        $http ({
            method: "GET",
            url: "/api/searchFriendsTable",
            params: {
                id1: $scope.id1,
                id2: $scope.id2
            }
            })
            .success(function(data) {
            	//console.log("Number of people found = "+data.length);
            	if(data.status === 200)
            {
            	$scope.message = "Cannot add as person is already your friend";
            }
            else
            {
            	//Add the message to notification db
           		$scope.message = "Request sents";
            }
            
		})
		  .error(function(data) {
            console.log('Error: ' + data);
        });
});
				
	
home.controller("groupCtrl", function($scope, $http) {


    $http.get('/api/getMyGroups')
        .success(function(data) {
            $scope.groups = data[0].groups;
            console.log("JSOn stringify: "+JSON.stringify(data[0].groups))
            console.log("Got all groups");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

		$scope.addGroup = function(grName)
		{
		console.log("Adding a group");
    	 $http ({
            method: "POST",
            url: "/api/addGroup",
             params: {
                grName: $scope.grName
            }
        }).success(function (result) {
        	$scope.grName = "";
        	$scope.grId = result.insertId;
        	console.log("Adding self to this group");
				$http ({
					method: "POST",
					url: "/api/addToGroup",
					params: {
						grId: $scope.grId
					}
				}).success(function (result) {
        			    $http.get('/api/getMyGroups')
        				.success(function(data) {
            				$scope.groups = data;
            				console.log("Got all groups");
        				}).error(function(data) {
            				console.log('Error: ' + data);
        				});
        		}).error(function (response) {
            		console.log("Promise not kept")
        		});
        }).error(function (response) {
            console.log("Promise not kept")
        });

    }
        
});	
	
home.controller("groupInfoCtrl", function($scope, $http, $routeParams) {
	$scope.groupId = $routeParams.groupId;
	$http ({
		method: "GET",
		url: "/api/getGroupMembers/"+$scope.groupId,
		params: {
			grId: $scope.groupId
		}
		})
        .success(function(data) {
            $scope.groupMembers = data;
            console.log("Got all members");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
		
	});	
		
