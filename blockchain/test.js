 //const socketPath = process.env.DOCKER_SOCKET_PATH
//const socketPath = process.env.NODE_ENV;
// const url = require('url');
// const socketPath = process.env.DOCKER_SOCKET_PATH || (process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock');
const resolve =require('path').resolve;
// const listOpts = {
//     socketPath,
//     method: 'GET',
//     path: '/images/json'
//   };

//   const pullOpts = {
//     socketPath,
//     method: 'POST',
//     path: url.format({
//       pathname: '/images/create',
//     //   query: {
//     //     fromImage: ccenvImage
//     //   }
//     })
//   };
//console.log(process.env);
console.log(process.env.GOPATH = resolve(__dirname, '../chaincode/src/go'));
