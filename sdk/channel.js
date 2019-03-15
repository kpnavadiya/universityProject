'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode Invoke
 */

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
const config = require('../blockchain/config');
//
var fabric_client = new Fabric_Client();
let envelope_bytes = config.test.channelConfig;
var config_update = fabric_client.extractChannelConfig(envelope_bytes);
console.log(config_update);
// setup the fabric network
var channel = fabric_client.newChannel(config.test.channelName);
var peer = fabric_client.newPeer(config.test.universityMember.peer.url);
channel.addPeer(peer);
var orderer = fabric_client.newOrderer(config.test.orderer0.url,config.test.orderer0.pem)
channel.addOrderer(orderer);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;
const signChannelConfig = (config_update) => {
	return new Promise((resolve, reject)=>{
		console.log("signing a channel update !!! ");
		var signature = fabric_client.signChannelConfig(config_update);
		signatures.push(signature);
		resolve(signatures);
	})
}
//console.log(signatures);
// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
	// assign the store to the fabric client
	fabric_client.setStateStore(state_store);
	var crypto_suite = Fabric_Client.newCryptoSuite();
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);

	// get the enrolled user from persistence, this user will sign all requests
	return fabric_client.getUserContext('user', true);
}).then((user_from_store) => {
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded user1 from persistence');
		member_user = user_from_store;
	} else {
		throw new Error('Failed to get user.... run registerUser.js');
	}
    const private_key = config.test.universityMember.admin.key;
    const certificate = config.test.universityMember.admin.cert;
    const mspid = config.test.universityMember.admin.mspid;
    fabric_client.setAdminSigningIdentity(private_key, certificate, mspid);
	// get a transaction id object based on the current user assigned to fabric client
	tx_id = fabric_client.newTransactionID();
	console.log("Assigning transaction_id: ", tx_id._transaction_id);
    //console.log("Admin_id: ", fabric_client);
	
	var request = {
		//targets: let default to the peer assigned to the client
		config: config_update, //the binary config
		signatures : [signChannelConfig], // the collected signatures
		name : channel, // the channel name
		orderer : orderer, //the orderer from above
		txId  : tx_id //the generated transaction id
	};

	// send the transaction proposal to the peers
    return fabric_client.createChannel(request);
    
});