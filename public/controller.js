var mainApp = angular.module("mainApp",["ngRoute"]);



mainApp.controller("dataController",['$scope','$http','$routeParams','$location','$window',function($scope ,$http,$routeParams,$location,$window)
{

    var url = "/api";
   $http.get(url).success( function(response) {
  		
		var names = [];
		var ages = [];
		var numbers = [];
		var _ids = [];
		var data = [];
		var images = [];
		var dates = [];
		for(i =0;i<response.length;i++)
		  	{
		  		names.push(response[i].name);
				_ids.push(response[i]._id);
				ages.push(response[i].age);
				numbers.push(response[i].number);
				images.push(response[i].image);
				dates.push(response[i].date);
				data.push(response[i]);

		  	}
		$scope.ids = _ids; 
   	$scope.ages = ages; 
    $scope.names = names;
		$scope.numbers = numbers;
		$scope.images = images;
		$scope.dates = dates;
		$scope.datas = data;
   }); 
   $scope.currentPage = 0;
   $scope.pageSize = 20;
   $scope.numberOfPages=function()
   	{
        return Math.ceil($scope.datas.length/$scope.pageSize);                
    }

    
  var urlsession = "/api/session";
  $http.get(urlsession).success( function(response) {
    $scope.user = response[0].id;
  });




     $scope.onclickshow = function(recordid) {
   		var url = "/api/edit/"+ recordid;
   		$http.get(url).success( function(response) {
   			
  			$scope.recorddata = response[0]; 
  			var image = response[0].image.split('/');  
  			$scope.recordimage =response[0].image;
   		});  
     	$scope.visible  = false;
    	$scope.visible = !$scope.visible;
  };
  $scope.onclickhide = function() {
	$scope.visible  = true;
 	$scope.visible = !$scope.visible;
  };


  $scope.deleteAll = function()
  {
    var url = "/api";
    $http.get(url).success( function(response) 
    {
      for(i =0;i<response.length;i++)
      { 
          if(response[i].name == $("#search").val() )
          {
              var urls = "/delete/"+response[i]._id;
              $http.get(urls).success( function(respon){
                  $window.location.href = '/personaldetails';
              });
          }
      }
    });
  };
  $scope.duplicate = function()
  {
    var url = "/api";
    $http.get(url).success( function(response) 
    {
      for(i =0;i<response.length;i++)
      { 
          var name = response[i].name;
          var searchval = $("#search").val();
          var filterval = $("#filter").val();
          if(name.includes(filterval))
          {
              var urls = "/api/duplicate/"+ response[i].name + "/"+ response[i].number + "/" +response[i].age+"/"+response[i].date.slice(0,10) +"/"+  response[i].image;
             $http.get(urls).success( function(respon){
                  $window.location.href = '/personaldetails';
              });
          }
          else if(searchval == null && filterval == null)
          {
              var urls = "/api/duplicate/"+ response[i].name + "/"+ response[i].number + "/" +response[i].age+"/"+response[i].date.slice(0,10) +"/"+  response[i].image;
             $http.get(urls).success( function(respon){
                  $window.location.href = '/personaldetails';
              });
          }
      }
    });
  };



}]);



mainApp.filter('startFrom', function() 
	{
    	return function(input, start) {
    		 if(input) 
    		 {
        		start = +start; //parse to int
        		return input.slice(start);
        	}
        return [];
    }	


});
