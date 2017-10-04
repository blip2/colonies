// dots and boxes installation
// server interface
// Ben Hussey - May 2017

var path = require('path')
var timers = require('timers')
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var segments = require('./segments');
var hardware = require('./hardware');

var state = "Random";
var manual_change = new Date();

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
    manual_change = new Date();
    if (state == "Off"){ state = "Creative"; }
    if (segment.type == "block"){ return; }
    var response = segments.segment_change(segment)
    if (!response) {
      io.emit('segments', segments.all_segments());
    } else {
      io.emit('segment-change', response);
    }
  });

  socket.on('state', function(new_state){
    console.log("state is now " + new_state)
    state = new_state;
    io.emit('state', state);
    manual_change = new Date();
  });

  socket.on('reset', function(){
    if (state == "Off"){ state = "Creative"; }
    io.emit('segments', segments.all_segments(true));
    manual_change = new Date();
  });
});

var tick = function() {
  // System runs between 9am and 9pm on weekdays (or for 20 mins after user interaction)
  var now = new Date()
  var timeout = (now - (1000 * 60 * 20))
  if (now.getDay() > 5 || now.getHours() < 9 || now.getHours() >= 21) {
    if (state != "Off" && manual_change < timeout) {
      console.log("outside working hours - turning off...")
      state = "Off";
      io.emit('state', state);
      io.emit('segments', segments.all_segments(true));
    }
  } else {
    if (state == "Off") {
      console.log("working hours - turning on...")
      state = "Random";
      io.emit('state', state);
      io.emit('segments', segments.all_segments(true));
    }
  }
  if (state == "Random") {
    var response = segments.random_change()
    if (response) {
      io.emit('segment-change', response);
    }
  }
}

setInterval(tick, 1000)

http.listen(3000, function(){
  console.log('listening on port 3000');
});
