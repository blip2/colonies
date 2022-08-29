// colonies service
// Ben Hussey - May 2017

var axios = require("axios");
var hardware = require("./hardware");
var segments = [];
var colors = {
  "#FF0000": { h: 0, s: 255, v: 225 },
  "#FFFF66": { h: 30, s: 255, v: 225 },
  "#66FF33": { h: 80, s: 255, v: 225 },
  "#00FFFF": { h: 110, s: 255, v: 225 },
  "#0000FF": { h: 150, s: 255, v: 225 },
  "#FF00AA": { h: 220, s: 255, v: 225 },
  "#CCCCCC": { h: 0, s: 0, v: 225 },
  "#333333": { h: 0, s: 0, v: 0 },
};

function Segment(id, row, col, type, color) {
  this.id = id;
  this.row = row;
  this.col = col;
  this.type = type;
  this.color = color;
}

function all_segments(clear = false) {
  // Return all segments if they exist already
  if (segments.length > 0 && !clear) {
    return segments;
  } else {
    segments = [];
    reset_all();
  }

  var i = 0;

  var h_rows = [0, 2, 4, 6, 8];
  var h_cols = [1, 3, 5, 7, 9, 11, 13];
  var hb_cols = [0, 2, 4, 6, 8, 10, 12, 14];
  var v_rows = [1, 3, 5, 7];
  var v_cols = [0, 2, 4, 6, 8, 10, 12, 14];
  var vb_cols = [1, 3, 5, 7, 9, 11, 13];

  for (row in h_rows) {
    for (col in h_cols) {
      segments.push(
        new Segment(i, h_rows[row], h_cols[col], "horiz", "#333333")
      );
      i++;
    }
    for (col in hb_cols) {
      segments.push(
        new Segment(i, h_rows[row], hb_cols[col], "hblock", "#000000")
      );
      i++;
    }
  }
  for (row in v_rows) {
    for (col in v_cols) {
      segments.push(
        new Segment(i, v_rows[row], v_cols[col], "vert", "#333333")
      );
      i++;
    }
    for (col in vb_cols) {
      segments.push(
        new Segment(i, v_rows[row], vb_cols[col], "vblock", "#000000")
      );
      i++;
    }
  }
  return segments;
}

function segment_change(segment) {
  update_segment(segment);
  segments = segments.filter(function (obj) {
    return obj.id !== segment.id;
  });
  segments.push(segment);
  return segment;
}

function random_change() {
  segment_list = segments.filter(function (seg) {
    return seg.type == "horiz" || seg.type == "vert";
  });
  segment = segment_list[Math.floor(Math.random() * segment_list.length)];
  if (segment) {
    var keys = Object.keys(colors);
    segment.color = keys[Math.floor(Math.random() * keys.length)];
    update_segment(segment);
    segments = segments.filter(function (obj) {
      return obj.id !== segment.id;
    });
    segments.push(segment);
    return segment;
  }
  return;
}

const api = () => {
  return axios.create({
    timeout: 1000,
  });
};

const handle_errors = (promise) => {
  return promise.catch((error) => {
    //console.log("Error Communicating with Arduino: ", error.message);
  });
};

function update_segment(segment) {
  // console.log(segment)
  var hw = hardware.SEGMENTS.filter(function (seg) {
    return seg.row == segment.row && seg.col == segment.col;
  })[0];
  if (hw) {
    if (segment.color) {
      var hsv = colors[segment.color];
      var url =
        "http://" +
        hw.ip +
        "/arduino/segment/" +
        hw.strip +
        "/" +
        hw.seq +
        "/" +
        parseInt(hsv["h"]) +
        "/" +
        parseInt(hsv["s"]) +
        "/" +
        parseInt(hsv["v"]) +
        "/0/";
    } else {
      var url =
        "http://" +
        hw.ip +
        "/arduino/segment/" +
        hw.strip +
        "/" +
        hw.seq +
        "/0/0/0/0/";
    }
    handle_errors(api().get(url));
  }
}

function reset_all() {
  hardware.CONTROLLERS.forEach(function (ip) {
    var url = "http://" + ip + "/arduino/off/0";
    handle_errors(api().get(url));
  });
}

exports.all_segments = all_segments;
exports.segment_change = segment_change;
exports.random_change = random_change;
