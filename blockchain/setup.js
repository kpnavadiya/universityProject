'use strict';

const config = require('./config');
const Org = require('./utils.js');
require('http');
require('url');
let status = 'down';
let statusChangedCallbacks = [];
//console.log("orderer:",config.test.orderer0);
//console.log("peer", config.test.universityMember.peer.hostname)
// Setup clients per organization
//const clients = config.test(obj => new OrganizationClient(config.channelName, config.orderer, obj.peer, obj.ca, obj.admin));
//console.log(clients);
// Setup clients per organization
const universitymemberClient =  new Org.orgClient(
  config.test.channelName,
  config.test.orderer0,
  config.test.universityMember.peer,
  config.test.universityMember.ca,
  config.test.universityMember.admin
);
const publicmemberClient =  new Org.orgClient(
  config.test.channelName,
  config.test.orderer0,
  config.test.universityMemberTest.peer,
  config.test.universityMemberTest.ca,
  config.test.universityMemberTest.admin
);
// const publicmemberClient =  new Org.orgClient(
//   config.test.channelName,
//   config.test.orderer0,
//   config.test.publicMember.peer,
//   config.test.publicMember.ca,
//   config.test.publicMember.admin
// );
//console.log(config.test.universityMember.ca);
function setStatus(s) {
  status = s;

  setTimeout(() => {
    statusChangedCallbacks
      .filter(f => typeof f === 'function')
      .forEach(f => f(s));
  }, 1000);
}

 function subscribeStatus(cb) {
  if (typeof cb === 'function') {
    statusChangedCallbacks.push(cb);
  }
}

 function getStatus() {
  return status;
}

  function isReady() {
  return status === 'ready';
}
//console.log(universitymemberClient.getOrgAdmin());
function getAdminOrgs() {
  return Promise.all([
    universitymemberClient.getOrgAdmin(),
    //publicmemberClient.getOrgAdmin()
    
  ]);
  
}

(async () => {
  // Login
  try {
    await Promise.all([
      universitymemberClient.login(),
      //publicmemberClient.login()
            
    ]);
    console.log("Yaaaaaaaaaaaaaaaaaaaaaa login");
  } catch (e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }
  // Setup event hubs
 //universitymemberClient.initEventHub();
  
  

  // Bootstrap blockchain network
  try {
    await getAdminOrgs();
    if (!(await universitymemberClient.checkChannelMembership())) {
      console.log('Default channel not found, attempting creation...');
      const createChannelResponse =
        await universitymemberClient.createChannel(config.test.channelConfig);
      if (createChannelResponse.status === 'SUCCESS') {
        console.log('Successfully created a new default channel.');
        console.log('Joining peer0.univrsitymember.uni.com to the default channel.');
       
        await Promise.all([
          universitymemberClient.joinChannel(),
          //publicmemberClient.joinChannel()
          
        ]);
        // Wait for 10s for the peers to join the newly created channel
        await new Promise(resolve => {
          setTimeout(resolve, 10000);
        });
      }
    }
  } catch (e) {
    console.log('Fatal error bootstrapping the blockchain network!');
    console.log(e);
    process.exit(-1);
  }

  // Initialize network
  try {
    await Promise.all([
      universitymemberClient.initialize(),
      //publicmemberClient.initialize()
      
    ]);
  } catch (e) {
    console.log('Fatal error initializing blockchain organization clients!');
    console.log(e);
    process.exit(-1);
   }

  })();

// Export organization clients

  //universitymemberClient,
  //publicmemberClient,
  

