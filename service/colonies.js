// colonies service
// Ben Hussey - May 2017

var path = require("path");

var express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  allowEIO3: true,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var segments = require("./segments");
var state = "Random";
var manual_change = new Date();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/segments", function (req, res) {
  res.send(segments.all_segments());
});

io.on("connection", function (socket) {
  // On client connect send all of the segments
  io.emit("segments", segments.all_segments());
  io.emit("state", state);

  // When a segment is changed, try to change locally
  // if successful push to all clients, otherwise push all local records
  socket.on("segment-change", function (segment) {
    manual_change = new Date();
    if (state == "Off") {
      state = "Creative";
    }
    if (segment.type == "block") {
      return;
    }
    var response = segments.segment_change(segment);
    if (!response) {
      io.emit("segments", segments.all_segments());
    } else {
      io.emit("segment-change", response);
    }
  });

  socket.on("segment-change-all", function (color) {
    manual_change = new Date();
    if (state == "Off") {
      state = "Creative";
    }
    segments.segment_change_all(color);
    io.emit("segments", segments.all_segments());
  });

  socket.on("state", function (new_state) {
    console.log("state is now " + new_state);
    state = new_state;
    io.emit("state", state);
    manual_change = new Date();
  });

  socket.on("reset", function () {
    if (state == "Off") {
      state = "Creative";
    }
    io.emit("segments", segments.all_segments(true));
    manual_change = new Date();
  });
});

var tick = function () {
  // System runs between 9am and 9pm on weekdays (or for 20 mins after user interaction)
  var now = new Date();
  var timeout = now - 1000 * 60 * 20;
  if (now.getDay() > 5 || now.getHours() < 9 || now.getHours() >= 22) {
    if (state != "Off" && manual_change < timeout) {
      console.log("outside working hours - turning off...");
      state = "Off";
      io.emit("state", state);
      io.emit("segments", segments.all_segments(true));
    }
  } else {
    if (state == "Off") {
      console.log("working hours - turning on...");
      state = "Random";
      io.emit("state", state);
      io.emit("segments", segments.all_segments(true));
    }
  }
  if (state == "Random") {
    var response = segments.random_change();
    if (response) {
      io.emit("segment-change", response);
    }
  }
};

httpServer.listen(5000);

segments.all_segments();
setInterval(tick, 1000);
console.log("started colonies service");
