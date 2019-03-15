'use strict';

const config = require('./config');
const Org = require('./utils.js');
require('http');
require('url');
let status = 'down';
let statusChangedCallbacks = [];
const private_key = config.test.publicMember.admin.key;
const certificate = config.test.publicMember.admin.cert;
const mspid = config.test.publicMember.admin.mspid;

const publicmemberClient =  new Org.orgClient(
    config.test.channelName,
    config.test.orderer0,
    config.test.publicMember.peer,
    config.test.publicMember.ca,
    config.test.publicMember.admin
  );

  //console.log(config.test.publicMember.admin);
  try {
    publicmemberClient.login();
   //console.log(publicmemberClient.login());
   console.log("login success????");
  } catch(e){
    console.log(e);
  }
  //publicmemberClient.initEventHub();

  // Bootstrap blockchain network
  try {
     publicmemberClient.getOrgAdmin();
     //publicmemberClient.setAdminSigningIdentity(private_key, certificate, mspid);
    //console.log(publicmemberClient.getOrgAdmin());
      try {
        publicmemberClient.joinChannel();
        
        console.log("Peer channel join!!!!");
       new Promise(resolve => {
          setTimeout(resolve, 10000);
        });
      } catch(e){
        console.log(e);
        console.log("Failed to join channel");
      }
  }catch(e){
    console.log(e);
    console.log("failed to get Admin details!!!!")
  }

  //Initialize network
  try {
     
      publicmemberClient.initialize()
      //console.log(publicmemberClient.initialize());
      console.log("Network Initialize..............");
      
  } catch (e) {
    console.log('Fatal error initializing blockchain organization clients!');
    console.log(e);
    process.exit(-1);
   }

