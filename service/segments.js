// colonies service
// Ben Hussey - May 2017

var axios = require("axios");
var hardware = require("./hardware");
var segments = [];

var colors = ["#FF0000", "#FFFF66", "#66FF33", "#00FFFF", "#0000FF", "#FF00AA", "#CCCCCC", "#333333",];


function hexToTuple(str) {
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/ig.test(str)) {
    var hex = str.substr(1);
    hex = hex.length == 3 ? hex.replace(/(.)/g, '$1$1') : hex;
    var rgb = parseInt(hex, 16);
    return [(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255];
  }
  return [0, 0, 0];
}

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

function segment_change_all(color) {
  set_all(color);
  return segments.map(function (obj) {
    if (["horiz", "vert"].includes(obj.type)) {
      obj["color"] = color;
    }
    return obj;
  });
}

function random_change() {
  segment_list = segments.filter(function (seg) {
    return seg.type == "horiz" || seg.type == "vert";
  });
  segment = segment_list[Math.floor(Math.random() * segment_list.length)];
  if (segment) {
    segment.color = colors[Math.floor(Math.random() * colors.length)];
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
    timeout: 2000,
  });
};

const handle_errors = (promise) => {
  return promise.catch((error) => {
    console.log("Axios Error: ", error.message);
  });
};

function update_segment(segment) {
  var hw = hardware.SEGMENTS.filter(function (seg) {
    return seg.row == segment.row && seg.col == segment.col;
  })[0];
  if (hw) {
    var data = {
      "actions": [
        {
          "action": "fill",
          "strip": hw.strip,
          "start": hw.start,
          "end": hw.end,
          "color": hexToTuple(segment.color),
        },
      ],
    }
    console.log('update', hw.ip, data)
    handle_errors(api().post(`http://${hw.ip}/change`, data));
  }
}

function set_all(color) {
  hardware.CONTROLLERS.forEach(function (ip) {
    var data = {
      "actions": [
        {
          "action": "setall",
          "color": hexToTuple(color),
        },
      ],
    }
    handle_errors(api().post(`http://${ip}/change`, data));
  });
}

function reset_all() {
  hardware.CONTROLLERS.forEach(function (ip) {
    handle_errors(api().get(`http://${ip}/clear`));
  });
}

exports.all_segments = all_segments;
exports.segment_change = segment_change;
exports.segment_change_all = segment_change_all;
exports.random_change = random_change;
