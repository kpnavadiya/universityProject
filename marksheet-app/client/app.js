// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function($scope, appFactory){

	$("#success_holder").hide();
	$("#success_create").hide();
	$("#error_holder").hide();
	$("#error_query").hide();
	

	$scope.queryMarksheet = function(){

		var id = $scope.marksheet_id;

		appFactory.queryMarksheet(id, function(data){
			$scope.query_marksheet = data;

			if ($scope.query_marksheet == "Could not locate tuna"){
				console.log()
				$("#error_query").show();
			} else{
				$("#error_query").hide();
			}
		});
	}

	$scope.createMarksheet = function(){

		appFactory.createMarksheet($scope.marksheet, function(data){
			$scope.create_marksheet = data;
			$("#success_create").show();
		});
	}

});

// Angular Factory
app.factory('appFactory', function($http){
	
	var factory = {};

	factory.queryMarksheet = function(id, callback){
    	$http.get('/get_marksheet/'+id).success(function(output){
			callback(output)
		});
	}

	factory.createMarksheet = function(data, callback){

		//data.location = data.longitude + ", "+ data.latitude;

		var marksheet = data.id + "-" + data.name + "-" + data.enrolno + "-" + data.exam + "-" + data.samester + "-" + data.cgpa;

    	$http.get('/add_marksheet/'+marksheet).success(function(output){
			callback(output)
		});
	}

	return factory;

});


