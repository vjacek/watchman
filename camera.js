var cv = require('opencv');
var lines = new cv.Matrix();
var camera = new cv.VideoCapture(0);


var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080');



// Start video capture
//socket.on('camera-start', function (socket) {
    capture();
//});

//setInterval(function() {
//    capture();
//}, 100);



function capture() {

    // Get the next frame
    camera.read(function(error, image) {
        var d = new Date();
        console.log('Sending: '+d.getTime());
        //image.save('/tmp/image'+d.toString()+'.jpg');

        // Send frame to the server
        socket.emit('camera', d.getTime());

    });

    // Capture another frame ASAP
    setTimeout(function() {
        capture();
    }, 35); // 1000 / 35 = 28.57 frames/sec

}
