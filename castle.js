var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var os = require('os');
var path = require('path');

var config = require('./config.js');

var port = config.port;

app.use(express.static(path.join(__dirname, '/')));

// Expose an endpoint for watchman scripts to find the Castle server's IP address
app.get('/locate', function(request, response) {
    console.log('/locate gotten by a watchman at '+request.ip);
    response.send(true);
});

server.listen(port, function () {
    console.log(`http://${os.hostname()}:`+port);
});

// An object holding the current/latest imageBuffer for each watchman client
// Indexed by watchman ID; the watchman's OS host name
var d = {};

//var mjpegReady = fastPromise();
//var rollCounter = 0;

// For building the file name
// TODO: this destroys the Dropbox, use /tmp for testing
//var dir = './video/';
var dir = '/tmp/';
var fileTimestamp = getNewTimestampString();
var extension = '.mjpeg';

io.on('connection', function(socket) {
    console.log('Got Connection');

    // Listen for data from any/all watchman
    socket.on('watchman', function(watchmanData) {
        console.log('Data from watchman '+watchmanData.id+' '+watchmanData.image.length);

        // Make latest image available to clients
        d[watchmanData.id] = watchmanData.image;

        // Write images to disk as a MJPEG
        //fs.appendFile(dir+watchmanData.id+'_'+(new Date()).getTime()+extension, watchmanData.image, function(error) {
        fs.appendFile(dir+watchmanData.id+'_'+fileTimestamp+extension, d[watchmanData.id], function(error) {
            if(error) {
                console.log('Error writing to disk.');
                console.log(error);
            }
        });

        // If the video file has gotten too big, start using a new file
        // Writing to timestamp named files prevents the need to ever roll/copy/move files
        // Files are written in place with the timestamp of when they are started
        fs.stat(dir+watchmanData.id+fileTimestamp+extension, (error, stats) => {
            if(stats != undefined && stats.size > 100000000) { // 100 MB
            //if(stats != undefined && stats.size > 1000000000) { // 1 GB
            //if(stats != undefined && stats.size > 5000000) { // 5 MB
                fileTimestamp = getNewTimestampString();
            }
        });


        // TODO: convert MJPEG to MP4?

    });


    socket.on('display-connect', function(data) {
        console.log('client connected');
        setInterval(function() {
            console.log('sending all latest frames to client');
            //socket.emit('display-data', {id: 'pi1', image: d['pi1']});
            Object.keys(d).forEach(function(watchman) {
                socket.emit('display-data', {id: watchman, image: d[watchman]});
            });
        }, 100);
    });

});

// 10 MB written in 43 seconds
// ... therefore...
// 100 MB written in 430 seconds / 7.1 minutes
// 1000 MB / 1GB written in 4300 seconds / 71 minutes / 1.2 hours
// 20 GB per day

// MacOS can't display ':' in filename...
function getNewTimestampString() {
    var d = new Date();
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'_'+d.getHours()+'-'+d.getMinutes();
}

function fastPromise() {
    return new Promise(function(resolve, reject) {
        resolve(true);
    });
}
