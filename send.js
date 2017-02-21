var os = require('os');
var io = require('socket.io-client');

// The Castle address is loaded dynamically and passed to this script as an argument
var socket = io.connect('http://'+process.argv[2]+':8888');

if(!process.stdin.isTTY) {
    var image = Buffer.alloc(0);

    // Data is read in chunks of up to 64K (65356 bytes)
    // These need to be assembled into JPEG before being sent to castle
    process.stdin.on('data', function(chunk) {
        if(chunk != undefined) {
            try {
            	image = Buffer.concat([image, chunk]);
            	if(chunk[chunk.length-2].toString(16) == 'ff' && chunk[chunk.length-1].toString(16) == 'd9') {
            	    console.log('Sending image to Castle '+image.length);
            	    socket.emit('watchman', {id: os.hostname(), image: image});
            	    image = Buffer.alloc(0);
            	}
            }
            catch(error) {
                console.log(error);
            }
        }
    });
}
