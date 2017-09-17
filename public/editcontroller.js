var mainApp = angular.module('mainApp', ['ngRoute']);

mainApp.config(['$routeProvider','$locationProvider',  function($routeProvider,$locationProvider) {

   $routeProvider.
      when('/edit/:number', {
     templateUrl: '',
    controller: 'editController',
   
      }).
      otherwise({
        redirectTo: '/'

      });
          $locationProvider.html5Mode(true);


      
}]);

mainApp.controller("editController",['$scope','$http','$routeParams','$location','$window',function($scope ,$http, $routeParams,$location,$window)
{
    

   var name = $location.path().split('/');  
   var url = "/api/edit/"+ name[2];
   $http.get(url).success( function(response) {
  		
		$scope.id = response[0]._id; 
   		$scope.age = response[0].age; 
       	$scope.name = response[0].name;
		$scope.number = response[0].number;
		$scope.image = response[0].image; 
		$scope.date = (response[0].date).slice(0,10);

   });  

	
	
   $scope.editSubmit = function()
   {
	var url = "/api/editSubmit/"+ name[2] + "/"+ $("#name").val() + "/" +$("#age").val()+"/"+$("#number").val() +"/"+  $("#image").val;
   $http.get(url).success( function(response) {
  		
		$window.location.href = '/personaldetails';
   });  

   };
   
   
}]);
