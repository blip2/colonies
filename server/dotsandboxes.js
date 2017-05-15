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

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log('Client Connected');
  io.emit('segments', segments.all_segments());

  socket.on('disconnect', function(){
    console.log('Client Disconnected');
  });

  socket.on('segment-change', function(segment){
    if (segment.type == "block"){ return; }
    var response = segments.segment_change(segment)
    if (!response) {
      io.emit('segments', segments.all_segments());
    } else {
      io.emit('segment-change', response);
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
