/***
 * Author: Valerio Gheri
 * Date: 03/04/2014
 * Entry point
 */
'use strict';

var winston = require('winston');
var webserver = require('./server');
// We will log normal api operations into api.log
console.info("starting logger...");
winston.add(winston.transports.File, {
	filename: "./logs/api.log"
});
// We will log all uncaught exceptions into exceptions.log
winston.handleExceptions(new winston.transports.File({
	filename: "./logs/exceptions.log"
}));
console.info("Starting Web and Primus server ...");
webserver.start();
//console.info("Waiting for incoming connections...");