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

/*
// Create socket connection to push updates from log file changes
io.on('connection', function(socket) {
    socket.on('log', function(data) {
		// run the tailing as a singleton
		if ( !tailing ) {
			tailing = 1;
			tailFile.on('line', function(data) {
				io.emit('log', data);
			});
		}
    });
});
*/
io.on('connection', function(socket) {

    console.log('Got Connection');

    // Send signal to clients to start their cameras
    //socket.emit('start-camera', 'start camera command');

    // Listen for camera data from clients
    socket.on('camera', function(data) {
        console.log(data);
    });
});
