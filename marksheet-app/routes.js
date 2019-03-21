//SPDX-License-Identifier: Apache-2.0

var marksheet = require('./controller.js');

module.exports = function(app){

  app.get('/get_marksheet/:id', function(req, res){
    marksheet.get_marksheet(req, res);
  });
  app.get('/add_marksheet/:marksheet', function(req, res){
    marksheet.add_marksheet(req, res);
  });
  
}
