var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var b64ab = require('base64-arraybuffer');


var os = require('os');
var path = require('path');
var port = 8888;
// don't need on server var cv = require('opencv');
// TODO: do all opencv processing on server


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

        console.log('got a connection from watchman '+watchmanData.id+' '+watchmanData.imageBuffer.length);


        // Make latest image available to clients
        d[watchmanData.id] = watchmanData.imageBuffer;

        //console.log(d[watchmanData.id]);

        //var a = b64ab.encode(d[watchmanData.id]);

        // TESTING: write jpeg files to disk
        //var date = (new Date()).getTime();
        //fs.writeFile(date+'.jpeg', d[watchmanData.id], {encoding: 'base64'}, function(error) {
        //    console.log(error);
        //});


        //var f = fs.createWriteStream(date+'.jpeg');
        //var blob = new Blob(a, {type: "image/jpeg"});
        //f.write(blob);
        //f.end();


        //console.log(d['send_script'].length);
    });


    socket.on('client-here', function(data) {
        console.log('client connected');


        setInterval(function() {
            console.log('sending to client '+d['send_script'].length);
            socket.emit('stream', d['send_script']);
        }, 100);


    });

});
