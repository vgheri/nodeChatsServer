/***
 * Author: Valerio Gheri
 * Date: 03/04/2014
 * Express web server configuration 
 */
'use strict';
var fs = require('fs');
var server = require('http').createServer(function(req,res) {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(__dirname + '/index.html').pipe(res);
});

var port = process.env.PORT || 4000;
server.listen(port, function() {
    console.info("Web server listening on port %d. Waiting for incoming connections...", port);
});