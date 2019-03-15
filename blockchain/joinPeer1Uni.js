'use strict';

const config = require('./config');
const Org = require('./utils.js');
require('http');
require('url');
let status = 'down';
let statusChangedCallbacks = [];


const publicmemberClient =  new Org.orgClient(
    config.test.channelName,
    config.test.orderer0,
    config.test.universityMemberTest.peer,
    config.test.universityMemberTest.ca,
    config.test.universityMemberTest.admin
  );
//console.log(publicmemberClient);
  (async () => {
    try {
   await publicmemberClient.login();
   //console.log(publicmemberClient.login());
   console.log("login success????");
  } catch(e){
    console.log(e);
  }
  //publicmemberClient.initEventHubs();

  // Bootstrap blockchain network
  try {
    await publicmemberClient.getOrgAdmin();
    //console.log(publicmemberClient.getOrgAdmin());
      try {
        // await publicmemberClient.joinChannel();
        // //console.log(publicmemberClient.joinChannel());
        // console.log("Peer channel join!!!!");
        await Promise.all([
          //universitymemberClient.joinChannel()
          publicmemberClient.joinChannel(),
          
        ]);
        console.log("Peer 1 channel join!!!!");
        await new Promise(resolve => {
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
    await 
      publicmemberClient.initialize()
      //console.log(publicmemberClient.initialize());
      console.log("Network Initialize..............");
      
  } catch (e) {
    console.log('Fatal error initializing blockchain organization clients!');
    console.log(e);
    process.exit(-1);
   }
}) ();
