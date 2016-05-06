var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var os = require('os');
var path = require('path');
var port = 8080;


server.listen(port, function () {
  console.log(`http://${os.hostname()}.local:${port}`);
});

app.use(express.static(path.join(__dirname, '/')));


var d;

io.on('connection', function(socket) {

    console.log('Got Connection');

    // Listen for camera data from cameras
    socket.on('camera', function(data) {
        console.log(data);

        // Make latest image available to clients
        d = data;

    });


    socket.on('client-here', function(data) {
        console.log('client connected');

        function sendData() {
            socket.emit('stream', d)
            setTimeout(function() {
                console.log('sending data to client');
                sendData();
            }, 1000);
        }

        sendData(socket);


    });

});
