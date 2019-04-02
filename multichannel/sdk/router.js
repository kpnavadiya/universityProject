var markTest = require('./controller.js');

module.exports = function(app){
    app.get('/create_Marksheet/:user/:data/:chaincode/:fun_name/:channelId', function(req, res){
        markTest.create_Marksheet(req, res);
    });
    app.get('/create_Marksheet_Mark/:markData', function(req, res){
        markTest.create_Marksheet_Mark(req, res);
    });
    app.get('/query_Marksheet_Id/:data', function(req, res){
        markTest.query_Marksheet_Id(req, res);
    });

}