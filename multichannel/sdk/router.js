var markTest = require('./controller.js');

module.exports = function(app){
    app.get('/create_Marksheet/:data', function(req, res){
        markTest.create_Marksheet(req, res);
    });
    app.get('/create_Marksheet_Mark/:markData', function(req, res){
        markTest.create_Marksheet_Mark(req, res);
    });

}