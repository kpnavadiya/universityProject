'use strict';

const config = require('./config');
const Org = require('./utils.js');
const http = require('http');
const url = require('url');
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
/*const publicmemberClient =  new Org.orgClient(
  config.test.channelName,
  config.test.orderer0,
  config.test.universityMemberTest.peer,
  config.test.universityMemberTest.ca,
  config.test.universityMemberTest.admin
);*/
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

 

  // Install chaincode on all peers
  let installedOnUniversityMember;
  try {
    await getAdminOrgs();
    installedOnUniversityMember = await universitymemberClient.checkInstalled(
      config.test.chaincodeId, config.test.chaincodeVersion, config.test.chaincodePath);
    
  } catch (e) {
    console.log('Fatal error getting installation status of the chaincode!');
    console.log(e);
    process.exit(-1);
  }

  if (!(installedOnUniversityMember)) {
    console.log('Chaincode is not installed, attempting installation...');

    // Pull chaincode environment base image
    try {
      await getAdminOrgs();
      const socketPath = process.env.DOCKER_SOCKET_PATH ||
      (process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock');
      const ccenvImage = process.env.DOCKER_CCENV_IMAGE ||
        'hyperledger/fabric-ccenv:1.3.0';
      const listOpts = { socketPath, method: 'GET', path: '/images/json' };
      const pullOpts = {
        socketPath, method: 'POST',
        path: url.format({ pathname: '/images/create', query: { fromImage: ccenvImage } })
      };
      console.log("SOCKETPATH : ",socketPath);
      const images = await new Promise((resolve, reject) => {
        const req = http.request(listOpts, (response) => {
          let data = '';
          response.setEncoding('utf-8');
          response.on('data', chunk => { data += chunk; });
          response.on('end', () => { resolve(JSON.parse(data)); });
        });
        req.on('error', reject); req.end();
      });

      const imageExists = images.some(
        i => i.RepoTags && i.RepoTags.some(tag => tag === ccenvImage));
      if (!imageExists) {
        console.log(
          'Base container image not present, pulling from Docker Hub...');
        await new Promise((resolve, reject) => {
          const req = http.request(pullOpts, (response) => {
            response.on('data', () => { });
            response.on('end', () => { resolve(); });
          }); 
          req.on('error', reject); req.end();
        });
        console.log('Base container image downloaded.');
      } else {
        console.log('Base container image present.');
      }
    } catch (e) {
      console.log('Fatal error pulling docker images.');
      console.log(e);
      process.exit(-1);
    }

     // Install chaincode
     const installationPromises = [
      universitymemberClient.install(
        config.test.chaincodeId, config.test.chaincodeVersion, config.test.chaincodePath)
      
    ];
    try {
      await Promise.all(installationPromises);
      await new Promise(resolve => {   setTimeout(resolve, 10000); });
      console.log('Successfully installed chaincode on the default channel.');
    } catch (e) {
      console.log('Fatal error installing chaincode on the default channel!');
      console.log(e);
      process.exit(-1);
    }

    // Instantiate chaincode on all peers
    // Instantiating the chaincode on a single peer should be enough (for now)
    try {
      // Initial contract types
      await universitymemberClient.instantiate(config.test.chaincodeId,
        config.test.chaincodeVersion);
      console.log('Successfully instantiated chaincode on all peers.');
      setStatus('ready');
    } catch (e) {
      console.log('Fatal error instantiating chaincode on some(all) peers!');
      console.log(e);
      process.exit(-1);
    }
  } else {
    console.log('Chaincode already installed on the blockchain network.');
    setStatus('ready');
  }
// Export organization clients

  //universitymemberClient,
  //publicmemberClient,
  
})();
