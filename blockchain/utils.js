'use strict';

const resolve =require('path').resolve;
const EventEmitter= require ('events').EventEmitter;

//import { load as loadProto } from 'grpc';
require('grpc');
//import Long from 'long';
//const Long = require('long').Long;
//import hfc from 'fabric-client';
const hfc = require('fabric-client');
//const utils = require('fabric-client/lib').utils;
 //import utils from 'node_modules/fabric-client/lib/utils';
// import Orderer from 'node_modules/fabric-client/lib/Orderer';
// import Peer from 'node_modules/fabric-client/lib/Peer';
//import EventHub from 'node_modules/fabric-client/lib/EventHub';
//const defaultEventHub= require('fabric-client/lib/EventHub');
const channelHub = require('fabric-client').ChannelEventHub;
//console.log(channelHub);
const User = require('fabric-client').User;
//import CAClient from 'fabric-ca-client';
const CAClient = require('fabric-ca-client');

//const snakeToCamelCase = require('node_modules/json-style-converter/index');
//const camelToSnakeCase = require('node_modules/json-style-converter').camelToSnakeCase;
process.env.GOPATH = resolve(__dirname, '../chaincode');
const JOIN_TIMEOUT = 120000,
  TRANSACTION_TIMEOUT = 120000;

class OrganizationClient extends EventEmitter {

  constructor(channelName, ordererConfig, peerConfig, caConfig, admin) {
    super();
    this._channelName = channelName;
    this._ordererConfig = ordererConfig;
    this._peerConfig = peerConfig;
    this._admin = admin;
    this._caConfig = caConfig;
    this._peers = [];
    this._eventHubs = [];
    this._client = new hfc();
      //console.log("client HFC:", this._client);
    // Setup channel
    this._channel = this._client.newChannel(channelName);
    //console.log("client:", this._channel);
    // Setup orderer and peers
    const orderer = this._client.newOrderer(ordererConfig.url, {
      pem: ordererConfig.pem,
      'ssl-target-name-override': ordererConfig.hostname
    });
    this._channel.addOrderer(orderer);

    const defaultPeer = this._client.newPeer(peerConfig.url, {
      pem: peerConfig.pem,
      'ssl-target-name-override': peerConfig.hostname
    });
    this._peers.push(defaultPeer);
    //console.log("peers push :", this._peers);
    this._channel.addPeer(defaultPeer);
    //console.log("add peer :", this._channel);
    this._adminUser = null;
  }

  async login() {
    try {
      this._client.setStateStore(
        await hfc.newDefaultKeyValueStore({
          path: `./${this._peerConfig.hostname}`
        }));
      this._adminUser = await getSubmitter(
        this._client, "admin", "adminpw", this._caConfig);
        //console.log("Admin Log in Success!!!!!!!!",this._adminUser);
    } catch (e) {
      console.log(`Failed to enroll user. Error: ${e.message}`);
      throw e;
    }
    //console.log("ADMIN :",this._caConfig);
    //console.log("ADMIN :",this._adminUser);
  }

   initEventHubs() {
    // Setup event hubs
    try {
      //console.log("EVENT HUB",this._client);
       defaultEventHub = this._client.newEventHub();
      //const defaultEventHub = this._client;
      //console.log("eventHub:",defaultEventHub);
      defaultEventHub.setPeerAddr(this._peerConfig.eventHubUrl, {
        pem: this._peerConfig.pem,
        'ssl-target-name-override': this._peerConfig.hostname
      });
      defaultEventHub.connect();
      defaultEventHub.registerBlockEvent(
        block => {
          this.emit('block', unmarshalBlock(block));
        });
      this._eventHubs.push(defaultEventHub);
    } catch (e) {
      console.log(`Failed to configure event hubs. Error ${e.message}`);
      throw e;
    }
  }
  initEventHub() {
    try {
      // create new objact ChannelEventHub
      //console.log(this._peerConfig.eventHubUrl);
      const channel = new channelHub(this._client, this._peerConfig);
      //console.log(channel);
      channel.getPeerAddr(this._peerConfig.eventHubUrl, {
        pem: this._peerConfig.pem,
        'ssl-target-name-override': this._peerConfig.hostname
      });
      channel.connect();
      channel.registerTxEvent(
           // this listener will be notificed of all transactions
             block => {
                this.emit('block', unmarshalBlock(block));
                console.log(util.format('Transaction %s has completed', tx));
             },
             (err) => {
                channel.unregisterTxEvent('block');
                reportError(err);
                console.log(util.format('Error %s! Transaction listener has been ' +
                         'deregistered for %s', err, channel.getPeerAddr()));
             }
         );
        
        //  channel.connect();
       console.log("Sucsess fully init channelevent hub !!!");

    } catch(e){
      console.log(e);
      console.log("Error while initing Hub !!! ");
        }
  }

  async getOrgAdmin() {
    //console.log(username);
    return this._client.createUser({
      username: `Admin@${this._peerConfig.hostname}`,
      mspid: this._caConfig.mspId,
      cryptoContent: {
        privateKeyPEM: this._admin.key,
        signedCertPEM: this._admin.cert
        
      }
    });
    //console.log(username);

  }
  
  async initialize() {
    try {
      await this._channel.initialize();
    } catch (e) {
      console.log(`Failed to initialize chain. Error: ${e.message}`);
      throw e;
    }
  }

  async createChannel(envelope) {
    const txId = this._client.newTransactionID();
    const channelConfig = this._client.extractChannelConfig(envelope);
    const signature = this._client.signChannelConfig(channelConfig);
    const request = {
      name: this._channelName,
      orderer: this._channel.getOrderers()[0],
      config: channelConfig,
      signatures: [signature],
      txId
    };
    const response = await this._client.createChannel(request);

    // Wait for 5sec to create channel
    await new Promise(resolve => {
      setTimeout(resolve, 5000);
    });
    return response;
  }

  async joinChannel() {
    try {
      const genesisBlock = await this._channel.getGenesisBlock({
        txId: this._client.newTransactionID()
      });
      const request = {
        targets: this._peers,
        txId: this._client.newTransactionID(),
        block: genesisBlock
      };
      //console.log("PEERS REQUEST :", request);
      const joinedChannelPromises = this._eventHubs.map(eh => {
        eh.connect();
        //console.log("joinedChannelPromises:",joinedChannelPromises);
        return new Promise((resolve, reject) => {
          let blockRegistration;
          const cb = block => {
            clearTimeout(responseTimeout);
            eh.unregisterBlockEvent(blockRegistration);
            if (block.data.data.length === 1) {
              const channelHeader =
                block.data.data[0].payload.header.channel_header;
              if (channelHeader.channel_id === this._channelName) {
                resolve();
              } else {
                reject(new Error('Peer did not join an expected channel.'));
              }
            }
          };
          //console.log("CB",cb);

          blockRegistration = eh.registerBlockEvent(cb);
          const responseTimeout = setTimeout(() => {
            eh.unregisterBlockEvent(blockRegistration);
            reject(new Error('Peer did not respond in a timely fashion!'));
          }, JOIN_TIMEOUT);
        });
      });

      const completedPromise = joinedChannelPromises.concat([
        this._channel.joinChannel(request)
      ]);
      await Promise.all(completedPromise);
      //console.log("Completed : ", this._channel);
    } catch (e) {
      console.log(`Error joining peer to channel. Error: ${e.message}`);
      throw e;
    }
  }

  async checkChannelMembership() {
    try {
      const { channels } = await this._client.queryChannels(this._peers[0]);
      if (!Array.isArray(channels)) {
        return false;
      }
      return channels.some(({channel_id}) => channel_id === this._channelName);
    } catch (e) {
      return false;
    }
  }

}

/**
 * Enrolls a user with the respective CA.
 *
 * @export
 * @param {string} client
 * @param {string} enrollmentID
 * @param {string} enrollmentSecret
 * @param {object} { url, mspId }
 * @returns the User object
 */

async function getSubmitter(
  client, enrollmentID, enrollmentSecret, {
    url,
    mspId
  }) {
     // var tempid=1;
    // console.log("client1: "+ tempid + " "+ mspId);
    //   tempid++;
    //console.log("client000", url);
  try {
    let user = await client.getUserContext(enrollmentID, true);
    if (user && user.isEnrolled()) {
      //console.log("client2:", user);
      return user;
    }
    //console.log("client3:", user.isEnrolled());
    // Need to enroll with CA server
    const ca = new CAClient(url, {
      verify: false
    });
    //console.log("client4:", ca);
    try {
      const enrollment = await ca.enroll({
        enrollmentID,
        enrollmentSecret
      });
      //console.log("client6:", enrollmentId);
      user = new User(enrollmentID, client);
      
      await user.setEnrollment(enrollment.key, enrollment.certificate, mspId);
      await client.setUserContext(user);
      //console.log("CA:", user);
      console.log("Approve................... ...");
      return user;
    } catch (e) {
      throw new Error(
        `Failed to enroll and persist User. Error: ${e.message}`);
    }
  } catch (e) {
    throw new Error(`Could not get UserContext! Error: ${e.message}`);
  }
}

 module.exports.wrapError = function (message, innerError) {
  let error = new Error(message);
  error.inner = innerError;
  console.log(error.message);
  throw error;
};

module.exports.marshalArgs=function(args) {
  if (!args) {
    return args;
  }

  if (typeof args === 'string') {
    return [args];
  }

  let snakeArgs = camelToSnakeCase(args);

  if (Array.isArray(args)) {
    return snakeArgs.map(
      arg => typeof arg === 'object' ? JSON.stringify(arg) : arg.toString());
  }

  if (typeof args === 'object') {
    return [JSON.stringify(snakeArgs)];
  }
};

module.exports.unmarshalResult = function (result) {
  if (!Array.isArray(result)) {
    return result;
  }
  let buff = Buffer.concat(result);
  if (!Buffer.isBuffer(buff)) {
    return result;
  }
  let json = buff.toString('utf8');
  if (!json) {
    return null;
  }
  let obj = JSON.parse(json);
  return snakeToCamelCase(obj);
};

 module.exports.unmarshalBlock=function(block) {
  const transactions = Array.isArray(block.data.data) ?
    block.data.data.map(({
      payload: {
        header,
        data
      }
    }) => {
      const {
        channel_header
      } = header;
      const {
        type,
        timestamp,
        epoch
      } = channel_header;
      return {
        type,
        timestamp
      };
    }) : [];
  return {
    id: block.header.number.toString(),
    fingerprint: block.header.data_hash.slice(0, 20),
    transactions
  };
};
 
exports.orgClient = OrganizationClient;
