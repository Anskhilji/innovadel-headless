'use strict';
var server = require('server');
server.extend(module.superModule);

server.append('SizeChart',function(req,res,next) {

    res.setHttpHeader('Access-Control-Allow-Origin', '*');

    next();
});

module.exports = server.exports();
