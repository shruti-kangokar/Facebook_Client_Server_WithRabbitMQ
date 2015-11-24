//loading the 'login' angularJS module
var groups = angular.module('groups', []);
//defining the login controller
groups.controller('groupsCtrl', function($scope, $http) {

	$scope.failedGrpCreate = true;
	$scope.successfulGrpCreate = true;
	
	
	$scope.createGroups =function()
	{
		console.log("Adding new group >>>>>" + $scope.groupName);
	    $http ({
        method: "POST",
        url: "/createGroup",
		data : {
			"grpname" : $scope.groupName
			}
		}).success(function (response) {
			$scope.failedGrpCreate = true;
			$scope.successfulGrpCreate = false;
		}).error(function (response) {
			$scope.failedGrpCreate = false;
			$scope.successfulGrpCreate = true;
		});
    }
    
});






