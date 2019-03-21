//require('node_modules/babel-core/register');
//require('node_modules/babel-polyfill');
//import { readFileSync } from 'fs';
//import { resolve } from 'path';
const fs = require('fs');
const resolve = require('path').resolve;
const basePath = resolve(__dirname, '../configuration/certs');
const readCryptoFile =
  filename => fs.readFileSync(resolve(basePath, filename)).toString();
const config = {
  channelName: 'mychannel',
  channelConfig: fs.readFileSync(resolve(__dirname, '../configuration/channel.tx')),
  chaincodeId: 'cama',
  chaincodeVersion: 'v1',
  chaincodePath: 'cama',
  orderer0: {
    hostname: 'orderer0.uni.com',
    url: 'grpc://localhost:7050',
    pem: readCryptoFile('orderer0.pem')
  },
  universityMember: {
    peer: {
      hostname: 'peer0.universitymember.uni.com',
      url: 'grpc://0.0.0.0:7051',
      eventHubUrl: 'grpc://peer0.universitymember.uni.com:7053',
      pem: readCryptoFile('universityMember.pem')
    },
    ca: {
      hostname: 'ca.uni.com',
      url: 'http://0.0.0.0:7054',
      mspId: 'UniversityMemberMSP',
      caName: 'ca.uni.com'
    },
    admin: {
      key: readCryptoFile('Admin@universityMember-org-key.pem'),
      cert: readCryptoFile('Admin@universitymember.uni.com-cert.pem'),
      mspid: 'UniversityMemberMSP'
    }
  },
  universityMemberTest: {
    peer: {
      hostname: 'peer1.universitymember.uni.com',
      url: 'grpc://0.0.0.0:7051',
      eventHubUrl: 'grpc://peer1.universitymember.uni.com:7053',
      pem: readCryptoFile('universityMemberTest.pem')
    },
    ca: {
      hostname: 'ca.uni.com',
      url: 'http://0.0.0.0:7054',
      mspId: 'UniversityMemberMSP',
      caName: 'ca.uni.com'
    },
    admin: {
      key: readCryptoFile('Admin@universityMember-org-key.pem'),
      cert: readCryptoFile('Admin@universitymember.uni.com-cert.pem'),
      mspid: 'UniversityMemberMSP'
    }
  },
  publicMember: {
    peer: {
      hostname: 'peer0.publicmember.uni.com',
      url: 'grpc://0.0.0.0:7051',
      eventHubUrl: 'grpc://peer0.publicmember.uni.com:7053',
      pem: readCryptoFile('publicmember.pem')
    },
    ca: {
      hostname: 'ca.public.com',
      url: 'http://0.0.0.0:7054',
      mspId: 'PublicMemberMSP',
      caName: 'ca.public.com'
    },
    admin: {
      key: readCryptoFile('Admin@publicmember-org-key.pem'),
      cert: readCryptoFile('Admin@publicmember.uni.com-cert.pem'),
      mspid: 'PublicMemberMSP'
    }
  },
    
};

if (process.env.LOCALCONFIG) {
  config.orderer0.url = 'grpc://localhost:7050';
  
  config.universityMember.peer.url = 'grpc://localhost:7051';
  config.universityMemberTest.peer.url = 'grpc://localhost:9051';
  config.publicMember.peer.url = 'grpc://localhost:8051';
  
  config.universityMember.peer.eventHubUrl = 'grpc://localhost:7053';
  config.universityMemberTest.peer.eventHubUrl = 'grpc://localhost:9053';
  config.publicMember.peer.eventHubUrl = 'grpc://localhost:8053';
  
  config.universityMember.ca.url = 'http://localhost:7054';
  config.publicMember.ca.url = 'http://localhost:8054';
  
  
}
 //export default config;
exports.test = config ;
//console.log(config);

