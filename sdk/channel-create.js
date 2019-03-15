// first read in the file, this gives us a binary config envelope
let envelope_bytes = fs.readFileSync(path.join(__dirname, 'newmortgage/config/channel.tx'));
// have the nodeSDK extract out the config update
console.log(envelope_bytes)
var config_update = client.extractChannelConfig(envelope_bytes);