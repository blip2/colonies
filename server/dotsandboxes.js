// dots and boxes installation
// server interface
// Ben Hussey - May 2017

var path = require('path')
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var segments = require('./segments');
var hardware = require('./hardware');

var state = "free";

// Routing and static files
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  // On client connect send all of the segments
  console.log('Client Connected');
  io.emit('segments', segments.all_segments());
  io.emit('state', state);

  socket.on('disconnect', function(){
    console.log('Client Disconnected');
  });

  // When a segment is changed, try to change locally
  // if successful push to all clients, otherwise push all local records
  socket.on('segment-change', function(segment){
    if (segment.type == "block"){ return; }
    var response = segments.segment_change(segment)
    if (!response) {
      io.emit('segments', segments.all_segments());
    } else {
      io.emit('segment-change', response);
    }
  });

  socket.on('state', function(new_state){
    state = new_state;
    io.emit('state', state);
  });

  socket.on('reset', function(){
    io.emit('segments', segments.all_segments(true));
  });
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});
