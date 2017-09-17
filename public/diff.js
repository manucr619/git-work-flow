/* global DIFF_INSERT, DIFF_DELETE, DIFF_EQUAL, diff_match_patch */
var app = angular.module('diffDemo', ['ngRoute','diff-match-patch']);

   app.controller('diffCtrl', ['$scope', function($scope) {
   	$scope.left = "test";
    $scope.right = "right";

   }]);
		

