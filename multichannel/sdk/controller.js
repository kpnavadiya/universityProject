// call the packages we need
var express       = require('express');        // call express
var app           = express();                 // define our app using express
var bodyParser    = require('body-parser');
var http          = require('http')
var fs            = require('fs');
var Fabric_Client = require('fabric-client');
var path          = require('path');
var util          = require('util');
var os            = require('os');
var createMarksheetApi = require('./Testsdk/createMarksheet');
var createApi = require('./Testsdk/create');
// call all the function request

module.exports = (function() {
return {
        create_Marksheet: function(req, res){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
            console.log("submit recording of student marksheet : ");

		var array = req.params.data.split("-");
		console.log(array);
            //{5-kp-101-rag-6-8.3}
		var key = array[0]
		var name = array[1]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
		var enrolno = array[2]
		var exam = array[3]
		var samester = array[4]
        var cgpa = array[5]
        //console.log("key :",key + "name : ", name);
        createMarksheetApi.test(key,name,enrolno,exam,samester,cgpa);
        },
        create_Marksheet_Mark: function(req, res){
            console.log("Submitting record");
            var array = req.params.markData.split("-");
            console.log(array);
                //{1-101-kp-6-ragular-8.3}
            var key = array[0]
            var name = array[1]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            var enrolno = array[2]
            var samester = array[3]
            var exam = array[4]
            var cgpa = array[5]
            // call create function from module
            createApi.testCreate(key,name,enrolno,samester,exam,cgpa);
        }
    

    }
})();