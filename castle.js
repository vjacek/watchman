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

        // Write images to disk as a MJPEG
        fs.appendFile(watchmanData.id+'.mjpeg', watchmanData.image, function(error) {
            if(error) {
                console.log('Error writing to disk.');
                console.log(error);
            }
        });


        // 10 MB written in 43 seconds
        // ... therefore...
        // 100 MB written in 430 seconds / 7.1 minutes
        // 1000 MB / 1GB written in 4300 seconds / 71 minutes / 1.2 hours
        // 20 GB per day

        // TODO: don't want to do this on every single write, just do like every 10th or 100th image...
        // Roll the video file once the current one has reached 100MB
        fs.stat(watchmanData.id+'.mjpeg', function(error, stats) {
            if(stats != undefined && stats.size > 100000000) {
            //if(stats != undefined && stats.size > 5000000) {
                var stream = fs.createReadStream(watchmanData.id+'.mjpeg').pipe(fs.createWriteStream(watchmanData.id+'-'+(new Date()).getTime()+'.mjpeg'));
                stream.on('finish', function() {
                    fs.unlink(watchmanData.id+'.mjpeg', function(error) {
                        if(error) {
                            console.log(error);
                        }
                    });
                });
            }
        });


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
