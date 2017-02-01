var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var os = require('os');
var path = require('path');
var port = 8080;
// don't need on server var cv = require('opencv');


server.listen(port, function () {
  console.log(`http://${os.hostname()}.local:${port}`);
});

app.use(express.static(path.join(__dirname, '/')));

// An object holding the current/latest imageBuffer for each watchman client
// Indexed by watchman ID; the watchman's OS host name
var d = {};

io.on('connection', function(socket) {

    console.log('Got Connection');

    // Listen for camera data from cameras
    socket.on('watchman', function(watchmanData) {
        // Make latest image available to clients
        d[watchmanData.id] = watchmanData.imageBuffer;
    });


    socket.on('client-here', function(data) {
        console.log('client connected');

        function sendData() {
            socket.emit('stream', d)
            setTimeout(function() {
                sendData();
            }, 100);
        }

        sendData(socket);

    });

});
