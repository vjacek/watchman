var cv = require('opencv');
var lines = new cv.Matrix();
var camera = new cv.VideoCapture(0);

var io = require('socket.io-client');
var socket = io.connect('http://192.168.1.9:8080');


capture();

function capture() {

    // Get the next frame and send it to the server
    camera.read(function(error, matrix) {
        socket.emit('camera', matrix.toBuffer());
    });

    // Capture another frame ASAP
    // 1000 / 35 = 28.57 frames/sec
    // < 10ms timeout appears too fast for sending via sockets
    setTimeout(function() {
        capture();
    }, 100);

}
