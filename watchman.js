var os = require('os');
var fs = require('fs');
var net = require('net');
var Promise = require('bluebird');
var request = require('request');
var io = require('socket.io-client');

var config = require('./config.js');

console.log('Watchman starting up...');

// Find the Castle server
var protocol = 'http://';
var subnet = config.subnet;
var ip = config.ipStart;
var ipMax = config.ipMax;
var port = ':'+config.port;
var path = '/locate';

var castleIp;

var ipPromises = [];

for(var i=ip; i<ipMax; i++) {
    console.log('Looking for Castle at '+subnet+i+port+path);
    ipPromises.push(locateCastle(subnet, i, port, path));
}

// Wait for all promises to resolve
// The index of result where there is a true result gives the Castle's IP
Promise.all(ipPromises).then(function(results) {
     castleIp = ip+results.indexOf(true);
     console.log('Found Castle at '+subnet+castleIp);


    var watchmanSocket = '/tmp/watchman.sock';
    var castleSocket = io.connect(protocol+subnet+castleIp+port);
    console.log(protocol+subnet+castleIp+port);

    var image = Buffer.alloc(0);

    // Clean up old/previous socket
    fs.unlink(watchmanSocket, function() {

    	// Create new server to listen on watchman socket
    	var unixServer = net.createServer(function(client) {
    	    console.log('Watchman Sender got connection from Watchman');

    	    // Each time data appears on the socket
    	    // Data is read in chunks of up to 64K (65356 bytes)
    	    // These need to be assembled into JPEG before being sent to castle
    	    client.on('data', function(chunk) {
        		//	    console.log(data);
        		if(chunk != undefined) {
        		    try {
                		image = Buffer.concat([image, chunk]);
                		if(chunk[chunk.length-2].toString(16) == 'ff' && chunk[chunk.length-1].toString(16) == 'd9') {
                		    console.log('Sending image to Castle '+image.length);
                		    castleSocket.emit('watchman', {id: os.hostname(), image: image});
                		    image = Buffer.alloc(0);
                		}
        		    }
        		    catch(error) {
                        console.log(error);
        		    }
        		}
    	    });
    	});

    	unixServer.listen('/tmp/watchman.sock', function() {
    	    console.log('Watchman Sender ready on /tmp/watchman.sock');
    	});

    });

});


function locateCastle(subnet, ip, port, path) {
    return new Promise(function(resolve, reject) {
    	request(protocol+subnet+ip+port+path, function(error, response, body) {
    	    if(!error) {
                resolve(true);
    	    }
    	    else {
                resolve(false);
    	    }
    	});
    });
}
