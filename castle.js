var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');


var os = require('os');
var path = require('path');
var port = 8888;
// var cv = require('opencv');
// TODO: do all opencv processing on server

app.use(express.static(path.join(__dirname, '/')));

// Expose an endpoint for watchman scripts to find the Castle server's IP address
app.get('/locate', function(request, response) {
    console.log('/locate gotten by a watchman');
    response.send(true);
});

server.listen(port, function () {
  console.log(`http://${os.hostname()}:${port}`);
});

// An object holding the current/latest imageBuffer for each watchman client
// Indexed by watchman ID; the watchman's OS host name
var d = {};


io.on('connection', function(socket) {
    console.log('Got Connection');

    // Listen for data from any/all watchman
    socket.on('watchman', function(watchmanData) {
        console.log('got a connection from watchman '+watchmanData.id+' '+watchmanData.image.length);

        // Make latest image available to clients
        d[watchmanData.id] = watchmanData.image;

        // TESTING: write jpeg files to disk
        //var date = (new Date()).getTime();
        //fs.writeFile(date+'.jpeg', d[watchmanData.id], {encoding: 'base64'}, function(error) {
        //    console.log(error);
        //});
    });


    socket.on('locus-connect', function(data) {
        console.log('client connected');
        setInterval(function() {
            console.log('sending all latest frames to client');
            //socket.emit('locus-data', {id: 'pi1', image: d['pi1']});
            Object.keys(d).forEach(function(watchman) {
                socket.emit('locus-data', {id: watchman, image: d[watchman]});
            });
        }, 100);
    });

});
