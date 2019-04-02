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
var queryApi = require('./Testsdk/queryMarksheet');
// call all the function request

module.exports = (function() {
return {
        create_Marksheet: function(req, res){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
            console.log("submit recording of student marksheet : ");

        var array = req.params.data.split("-");
        var key = array[0]
        var name = array[1]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
        var enrolno = array[2]
        var exam = array[3]
        var samester = array[4]
        var cgpa = array[5]
        var username  = req.params.user;
        var chaincode = req.params.chaincode;
        var fun_name = req.params.fun_name;
        var channelId = req.params.channelId;
        console.log(array)
        //createMarksheetApi.test(key,name,enrolno,exam,samester,cgpa,username,chaincode,fun_name,channelId);
        if (username == 'user1'){
            //console.log('user1 loged in!!!');
            if (chaincode == 'mark'){
               // console.log('chaincode  --> MAR');
                if (fun_name == 'createMarksheet'){
                    //console.log(array);
                    //{5-kp-101-rag-6-8.3}
                    //console.log("key :",key + "name : ", name);
                    createMarksheetApi.test(key,name,enrolno,exam,samester,cgpa,username,chaincode,fun_name,channelId);
                } else if(fun_name == 'queryMarksheet'){
                    queryApi.test(key,username,chaincode,fun_name);
                } else {

                    console.log("INVALID FUNCTION NAME !!!");
                }
            } else {
                console.log("Invalid chaincode name!!!");
            }
        } else if(username == 'user2'){
            createMarksheetApi.test(key,name,enrolno,exam,samester,cgpa,username,chaincode,fun_name);
        } else {
            console.log('invalid user!!!');
            res.send('invalid User!!');
        }
            res.send("create function is ok");
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
            res.send('Ok....');
        },
        query_Marksheet_Id: function(req, res){
            console.log("Query a record");
            // call create function from module
            var key = req.params.data;
            console.log("enterd key is :", key);
              //queryApi.test(key,function(err,respons){
                //console.log("111111111111111111111",respons);
                queryApi.test(key);
                res.send('Ok....');
              
            
        }
    

    }
})();