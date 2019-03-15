//var readFileSync = require('fs').readFileSync;
var resolve = require('path').resolve;
var fs = require("fs");
const basePath = resolve(__dirname, './certs');
const readCryptoFile = filename => fs.readFileSync(resolve(basePath, filename)).toString();
const config = {
  channelName: 'mychannel',
  channelConfig: fs.readFileSync(resolve(__dirname, 'channel.tx')),
  chaincodeId: 'myms',
  chaincodeVersion: '1',
  chaincodePath: 'myms',
  orderer: {
    hostname: 'orderer0.uni.com',
    url: 'grpcs://orderer0.uni.com:7050',
    pem: readCryptoFile('orderer0.pem')
  },
  peers: [{
    peer: {
      hostname: 'peer0.universitymember.uni.com',
      url: 'grpcs://peer0.universitymember.uni.com:7051',
      eventHubUrl: 'grpcs://peer0.universitymember.uni.com:7053',
      pem: readCryptoFile('universityMember.pem'),
      userKeystoreDBName: 'seller_db',
      userKeystoreDBUrl: 'http://ca-datastore:5984',
      stateDBName: 'member_db',
      stateDBUrl: 'http://shop-statedb:5984',
      org: 'org.UniversityMember',
      userType: 'validater'
    },
    ca: {
      hostname: 'universitymember-ca',
      url: 'https://universitymember-ca:7054',
      mspId: 'UniversityMemberMSP',
      caName: 'universitymember-ca'
    },
    admin: {
      key: readCryptoFile('Admin@universityMember-org-key.pem'),
      cert: readCryptoFile('Admin@universitymember.uni.com-cert.pem')
    }
  }, {
    peer: {
      hostname: 'peer0.publicmember.uni.com',
      url: 'grpcs://peer0.publicmember.uni.com:8051',
      pem: readCryptoFile('publicmember.pem'),
      userKeystoreDBName: 'user_db',
      userKeystoreDBUrl: 'http://ca-datastore:5984',
      stateDBName: 'member_db',
      stateDBUrl: 'http://publicmember-statedb:5984',
      eventHubUrl: 'grpcs://publicmember:7053',
      org: 'org.PublicMember',
      userType: 'user'
    },
    ca: {
      hostname: 'publicmember-ca',
      url: 'https://publicmember-ca:8054',
      mspId: 'PublicMemberMSP',
      caName: 'publicmember-ca'
    },
    admin: {
      key: readCryptoFile('Admin@publicmember-org-key.pem'),
      cert: readCryptoFile('Admin@publicmember.uni.com-cert.pem')
    }
  }]
};
if(process.env.LOCALCONFIG) {
  config.orderer.url = 'grpcs://localhost:7050';
  config.peers[0].peer.url = 'grpcs://localhost:7051';
  config.peers[0].peer.eventHubUrl = 'grpcs://localhost:7053';
  config.peers[0].ca.url = 'https://localhost:7054';
  config.peers[0].peer.userKeystoreDBUrl = 'http://localhost:5984';
  config.peers[0].peer.stateDBUrl = 'http://localhost:9984';
  config.peers[1].peer.url = 'grpcs://localhost:8051';
  config.peers[1].peer.eventHubUrl = 'grpcs://localhost:8053';
  config.peers[1].ca.url = 'https://localhost:8054';
  config.peers[1].peer.userKeystoreDBUrl = 'http://localhost:5984';
  config.peers[1].peer.stateDBUrl = 'http://localhost:8984';
}
//export default config;
fs.writeFile("./config.json", JSON.stringify(config), (err) => {
  if(err) {
    console.error(err);
    return;
  }
  console.log("File has been created");
});