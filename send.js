var io = require('socket.io-client');
var socket = io.connect('http://192.168.0.104:8888');

//var fs = require('fs');


if(!process.stdin.isTTY) {

//    var isFrameComplete = false;
    var frameTotal = Buffer.alloc(0);
    
    process.stdin.on('data', function(frame) {
	console.log('got a frame '+frame.length);

	//console.log(frame);
	
	frameTotal = Buffer.concat([frameTotal, frame]);
	
	if(frame[frame.length-2].toString(16) == 'ff' && frame[frame.length-1].toString(16) == 'd9') {
	    console.log('sending frame to watchman '+frameTotal.length);
	    socket.emit('watchman', {id: 'send_script', imageBuffer: frameTotal});
	    frameTotal = Buffer.alloc(0);
	}



	    
//	console.log(frame[0].toString(16)+' '+frame[1].toString(16)+' '+frame[2].toString(16)+' '+frame[3].toString(16)+
//		    ' ... '+frame[frame.length-4].toString(16)+' '+frame[frame.length-3].toString(16)+' '+frame[frame.length-2].toString(16)+' '+frame[frame.length-1].toString(16));

	
	//socket.emit('watchman', {id: 'send_script', imageBuffer: frame});

	//var d = (new Date()).getTime();
	//fs.writeFile(d+'.jpeg', frame, {encoding:'base64'}, function(error) {
	//    if(error) {
	//	console.log(error);
	//    }
	//});

	
    });
}


