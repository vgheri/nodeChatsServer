/***
 * Author: Valerio Gheri
 * Date: 03/04/2014
 * Express web server configuration 
 */
'use strict';

var express = require('express');
var app = express();
var fs = require('fs');
var expressLogFile = fs.createWriteStream('./logs/express.log', {flags: 'a'});
var Primus = require('primus');
var http = require('http');

// Express configuration
app.configure(function() {
    app.use(express.logger({stream: expressLogFile}));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});
app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function() {
    app.use(express.errorHandler());
});

// Express routes definition
app.get('/public/primus.js', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    fs.createReadStream(__dirname + '/public/primus.js').pipe(res);
});
app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  fs.createReadStream(__dirname + '/index.html').pipe(res);
});

var server = http.createServer(app)

// Primus configuration
var primus = new Primus(server, {    
        transformer: 'engine.io',
        origins: "*"
});

primus.save(__dirname + '/public/primus.js');

primus.on('connection', function(spark) {
    console.info(spark.id + ' connected');
    // message format:
    // sender: name of the sender
    // message: the content
    // timestamp: timestamp of the message
    spark.on('data', function(data) {
        console.info(spark.id + ' just sent a message');        
        if (data.sender && data.content) {
            primus.forEach(function (loopSpark, id, connections) {                
                if (id !== spark.id) {
                    //console.info('message broadcasted to: ' + id);
                    loopSpark.write(data);
                }
            });
        }
    });
}).on('disconnection', function(spark) {
    console.info(spark.id + ' disconnected');
});

// Function that start the Primus server
function start() {
    var port = process.env.PORT || 3000;
    server.listen(port, function() {
        console.info("Web and Primus server listening on port %d. Waiting for incoming connections...", port);
    });
}
// *******************************************************
exports.start = start;