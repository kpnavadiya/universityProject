var cors = require('cors');

require('../blockchain/config.js');
var hfc = require('fabric-client');


var helper = require('./helper.js');
var createChannel = require('./channel.js');
// var join = require('./app/join-channel.js');
// var install = require('./app/install-chaincode.js');
// var instantiate = require('./app/instantiate-chaincode.js');
// var invoke = require('./app/invoke-transaction.js');
// var query = require('./app/query.js');
// var host = process.env.HOST || hfc.getConfigSetting('host');
// var port = process.env.PORT || hfc.getConfigSetting('port');



// Register and enroll user
async function register (username, orgName) {
	var username = username;
	var orgName = orgName;
	// logger.debug('End point : /users');
	// logger.debug('User name : ' + username);
    // logger.debug('Org name  : ' + orgName);
    console.log("USERNAME :", username);
    console.log("ORG NAME", orgName)
	// if (!username) {
	// 	res.json(getErrorMessage('\'username\''));
	// 	return;
	// }
	// if (!orgName) {
	// 	res.json(getErrorMessage('\'orgName\''));
	// 	return;
    // }
    
	let response = await helper.getRegisteredUser(username, orgName, true);
	//logger.debug('-- returned from registering the username %s for organization %s',username,orgName);
	if (response && typeof response !== 'string') {
        console.log("user register successfully!!");
		// logger.debug('Successfully registered the username %s for organization %s',username,orgName);
		// response.token = token;
		// res.json(response);
	} else {
        console.log("failed to register");
		// logger.debug('Failed to register the username %s for organization %s with::%s',username,orgName,response);
		// res.json({success: false, message: response});
	}

}
register('admin', 'UniversityMember');