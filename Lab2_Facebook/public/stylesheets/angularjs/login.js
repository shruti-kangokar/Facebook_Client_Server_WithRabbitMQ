//loading the 'login' angularJS module
var login = angular.module('login', []);
//defining the login controller
login.controller('login', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.invalid_login = true;
	$scope.successful_signin = true;
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/checklogin',
			data : {
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(data) {
		
			console.log("Data is :" +data);
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
			}
			else {
				console.log("Test output");
				//Making a get call to the '/redirectToHomepage' API
				window.location.assign("/homepage");
				} 
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
	};
	
	$scope.months = [
        {MonthId : 1, MonthName : 'January' },       
        { MonthId: 2, MonthName : 'Feburary' },
        { MonthId: 3, MonthName : 'March' } ,
         {MonthId : 4, MonthName : 'April' },       
        {MonthId : 5, MonthName : 'May' },
        {MonthId : 6, MonthName : 'June' } ,
         {MonthId : 7, MonthName : 'July' },       
        {MonthId : 8, MonthName : 'August' },
        {MonthId : 9, MonthName : 'September' } ,
         {MonthId : 10, MonthName : 'October' },       
        {MonthId : 11, MonthName : 'November' },
        {MonthId : 12, MonthName : 'December' }
        ];
        
   $scope.date = [
        {DateId : 1, DateName : '1' },       
        { DateId: 2, DateName : '2' },
        { DateId: 3, DateName : '3' } ,
         {DateId : 4, DateName : '4' },       
        {DateId : 5, DateName : '5' },
        {DateId : 6, DateName : '6' } ,
         {DateId : 7, DateName : '7' },       
        {DateId : 8, DateName : '8' },
        {DateId : 9, DateName : '9' } ,
         {DateId : 10, DateName : '10' },       
        {DateId : 11, DateName : '11' },
        {DateId : 12, DateName : '12' } ,
        {DateId : 13, DateName : '13' },       
        { DateId: 14, DateName : '14' },
        { DateId: 15, DateName : '15' } ,
         {DateId : 16, DateName : '16' },       
        {DateId : 17, DateName : '17' },
        {DateId : 18, DateName : '18' } ,
         {DateId : 19, DateName : '19' },       
        {DateId : 20, DateName : '20' },
        {DateId : 21, DateName : '21' } ,
         {DateId : 22, DateName : '22' },       
        {DateId :23, DateName : '23' },
        {DateId : 24, DateName : '24' } ,
         {DateId : 25, DateName : '25' },
        {DateId : 26, DateName : '26' } ,
         {DateId : 27, DateName : '27' },       
        {DateId : 28, DateName : '28' },
        {DateId : 29, DateName : '29' } ,
         {DateId : 30, DateName : '30' },       
        {DateId : 31, DateName : '31' }
        ];
        
        
        $scope.year = [
        {YearId : 1, YearName : '2015' },       
        { YearId: 2, YearName : '2014' },
        { YearId: 3, YearName : '2013' } ,
         {YearId : 4, YearName : '2012' },       
        {YearId : 5, YearName : '2011' },
        {YearId : 6, YearName : '2010' } ,
         {YearId : 7, YearName : '2009' },       
        {YearId : 8, YearName : '2008' },
        {YearId : 9, YearName : '2007' } ,
         {YearId : 10, YearName : '2006' },       
        {YearId : 11, YearName : '2005' },
        {YearId : 12, YearName : '2004' } ,
         {YearId : 13, YearName : '2003' },       
        {YearId : 14, YearName : '2002' },
        {YearId : 15, YearName : '2001' }
        ];     
        
        
        
       $scope.addUser = function() {

        console.log("firstname" + $scope.user.fname);
		console.log("lastname" + $scope.user.lname);
		console.log("email" + $scope.user.email);
		console.log("password" +$scope.user.password);
		console.log("gender" + $scope.user.gender);
		console.log("month" + $scope.monthId);
		console.log("date" + $scope.dateId);
		console.log("year" +$scope.yearId);	
       
		$http({
			method : "POST",
			url : '/addUser',
			data : {
				"firstname" : $scope.user.fname,
				"lastname" : $scope.user.lname,
				"email" : $scope.user.email,
				"password" : $scope.user.password,
				"gender" : $scope.user.gender,
				"month" : $scope.monthId,
				"date" : $scope.dateId,
				"year" : $scope.yearId	
			}
		}).success(function(data) {
		
			//console.log("Data is :" +data);
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_login = false;
				$scope.successful_signin = true;
			}
			else {
				$scope.invalid_login = true;
				$scope.successful_signin = false;
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage");
				} 
		}).error(function(error) {
			$scope.unexpected_error = false;
			$scope.invalid_login = true;
		});
	};
    });
    