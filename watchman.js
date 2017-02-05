var cv = require('opencv');
var lines = new cv.Matrix();
//var camera = new cv.VideoCapture(0);
var RaspiCam = require('raspicam');
var io = require('socket.io-client');
var os = require('os');

var camera = new RaspiCam({
    mode: 'video',
    output: '-'
});

// Connect to the Castle server
var socket = io.connect('http://192.168.1.103:8080');
//var socket = io.connect('http://127.0.0.1:8080');

// Each Watchman client has a unique identifier
var hostname = os.hostname();
hostname = hostname.replace('.local');


// Start frame capturing at specified rate
// < 10ms timeout appears to be too fast for sending via sockets
// 1000 / 35 = 28.57 frames/sec
// 1000 / 100 = 10 frames/sec
var fps = 30;
var rate = 1000 / fps;

camera.start();

camera.on("read", function(err, timestamp, filename){
    //do stuff
});


//setInterval(capture, 1);



function capture() {

    // Get the next frame and send it to the server
    camera.read(function(error, matrix) {

	console.log(matrix.size());
	
	// TODO Change to try/catch
	if(!error) {	
            socket.emit('watchman', {id: hostname, imageBuffer: matrix.toBuffer()});
	}
	else {
	    console.log(error);
	}
	    
    });

}
