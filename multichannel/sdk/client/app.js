// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);



// Angular Factory
app.factory('appFactory', function($http){
	
	var factory = {};

	factory.queryMarksheet = function(id, callback){
    	$http.get('/create_marksheet/'+id).success(function(output){
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

