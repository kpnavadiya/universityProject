'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode Invoke
 */
//const resolve =require('path');
var Fabric_Client = require('fabric-client');
// var path = require('path');
// var util = require('util');
// var os = require('os');
const config = require('../blockchain/config');
//const Org = require('./utils.js');

//
var client = new Fabric_Client();
//console.log(client);
// first read in the file, this gives us a binary config envelope
let envelope_bytes = config.test.channelConfig;
console.log("channel_config:",envelope_bytes);
// have the nodeSDK extract out the config update
var config_update = client.extractChannelConfig(envelope_bytes);
//console.log("config_update:",config_update);
const private_key = config.test.universityMember.admin.key;
const certificate = config.test.universityMember.admin.cert;
const mspid = config.test.universityMember.admin.mspid;

//console.log(client);


	  
// signing and submit channel update
const signChannelConfig = (config_update) => {
	return new Promise((resolve, reject)=>{
		console.log("signing a channel update !!! ");
		var signature = client.signChannelConfig(config_update);
		signatures.push(signature);
		resolve(signatures);
	})
}
const setAdminAsUser = async () => {
	try {
	  const admin = await client.getUserContext('admin', true)
	  return client.setUserContext(admin, true)
	} catch(error) {
	  console.log('Error setting admin as user', error)
	}
  }
  setAdminAsUser();
//console.log("signature :", signature);
//  create ordere objact
var orderer = client.newOrderer(config.test.orderer0.url,config.test.orderer0.pem);
// Pass channel name
var mychannel = client.newChannel(config.test.channelName);
// have the SDK generate a transaction id


 
	let tx_id = client.newTransactionID();
	//const config_update = client.extractChannelConfig(envelope_bytes);
	//const signature = client.signChannelConfig(config_update);
	const request = {
		config: config_update, //the binary config
		signatures : signChannelConfig, // the collected signatures
		name : mychannel, // the channel name
		orderer : orderer, //the orderer from above
		txId  : tx_id //the generated transaction id
	};
  console.log(request);
  // this call will return a Promise
  //const response = await client.createChannel(request);
  const createChannelResponse =
		    client.createChannel(request);
		   



const invitePeerToChannel = async () => {
	client.setAdminSigningIdentity(private_key, certificate, mspid);
	console.log('invite peer to channel')
  
	//var newChannel = client.newChannel(mychannel);
	//var orderer  = fabric_client.newOrderer('grpc://localhost:7050');
	var peer = client.newPeer(config.test.universityMember.peer.url);
  
	mychannel.addOrderer(orderer);
	mychannel.addPeer(peer);
  
	tx_id = fabric_client.newTransactionID(true);
	let g_request = {
	  txId: tx_id
	};
  
	// get the genesis block from the orderer
	mychannel.getGenesisBlock(g_request).then((block) =>{
	  genesis_block = block;
	  tx_id = fabric_client.newTransactionID(true);
	  let j_request = {
		targets: ['localhost:7051'],
		block: genesis_block,
		txId: tx_id
	  };
  
	  console.log(JSON.stringify(j_request))
  
	  // send genesis block to the peer
	  return mychannel.joinChannel(j_request);
	}).then((results) =>{
	  if(results && results.response && results.response.status == 200) {
		console.log('Joined correctly')
	  } else {
		console.log('Failed', results)
	  }
	});
  }
  invitePeerToChannel();