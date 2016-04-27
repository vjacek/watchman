var av = require('tessel-av');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var os = require('os');
var path = require('path');
var cp = require('child_process');
var fs = require('fs');
var port = 8080;

server.listen(port, function () {
  console.log(`http://${os.hostname()}.local:${port}`);
});

app.use(express.static(path.join(__dirname, '/')));


//io.on('connection', function(socket) {


//    socket.on('ready', function() {
        var camera = new av.Camera();
        console.log(camera);

        var capture = camera.capture();
        console.log(capture);

        //camera.on('data', function(data) {
        //    console.log(data);
        //    socket.emit('image', data.toString('base64'));
        //});

        //socket.emit('image', 'ready received and looped back to web page');
        //var capture = camera.capture();

        capture.on('data', function(data) {
            console.log('data event');
            console.log
            fs.writeFile(path.join('/home/victor', 'captured-via-data-event.jpg'), data);
        });

//    });

//});





/*
io.on('connection', (socket) => {
  var camera = new av.Camera();

  socket.on('ready', () => camera.stream());

  camera.on('data', (data) => {
    socket.emit('image', data.toString('base64'));
  });
});
*/

process.on("SIGINT", _ => server.close());
