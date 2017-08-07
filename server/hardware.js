// dots and boxes installation
// server interface
// Ben Hussey - May 2017

// Controller IPs defined here
var CONTROLLERS = [
    "192.168.10.101",
    "192.168.10.102",
    "192.168.10.103",
    "192.168.10.104",
    "192.168.10.105",
    "192.168.10.106",
]

// Segment map defined below
// Each row and col should be assigned to a controller strip and sequence
// Blocks should not be assigned to controllers (odd columns in odd rows)
var SEGMENTS = [
{
    ip: CONTROLLERS[1],
    strip: 0,
    seq: 0,
    row: 0,
    col: 1,
},
{
    ip: CONTROLLERS[1],
    strip: 0,
    seq: 1,
    row: 0,
    col: 3,
},
{
    ip: CONTROLLERS[1],
    strip: 0,
    seq: 2,
    row: 0,
    col: 5,
},
{
    ip: CONTROLLERS[1],
    strip: 0,
    seq: 3,
    row: 0,
    col: 7,
},
{
    ip: CONTROLLERS[1],
    strip: 1,
    seq: 0,
    row: 1,
    col: 2,
},
{
    ip: CONTROLLERS[1],
    strip: 1,
    seq: 1,
    row: 3,
    col: 2,
},
{
    ip: CONTROLLERS[1],
    strip: 1,
    seq: 2,
    row: 5,
    col: 2,
},
{
    ip: CONTROLLERS[1],
    strip: 1,
    seq: 3,
    row: 7,
    col: 2,
},
{
    ip: CONTROLLERS[2],
    strip: 0,
    seq: 0,
    row: 2,
    col: 1,
},
{
    ip: CONTROLLERS[2],
    strip: 0,
    seq: 1,
    row: 2,
    col: 3,
},
{
    ip: CONTROLLERS[2],
    strip: 0,
    seq: 2,
    row: 2,
    col: 5,
},
{
    ip: CONTROLLERS[2],
    strip: 0,
    seq: 3,
    row: 2,
    col: 7,
},
{
    ip: CONTROLLERS[2],
    strip: 1,
    seq: 0,
    row: 1,
    col: 4,
},
{
    ip: CONTROLLERS[2],
    strip: 1,
    seq: 1,
    row: 3,
    col: 4,
},
{
    ip: CONTROLLERS[2],
    strip: 1,
    seq: 2,
    row: 5,
    col: 4,
},
{
    ip: CONTROLLERS[2],
    strip: 1,
    seq: 3,
    row: 7,
    col: 4,
},
{
    ip: CONTROLLERS[2],
    strip: 2,
    seq: 0,
    row: 1,
    col: 6,
},
{
    ip: CONTROLLERS[2],
    strip: 2,
    seq: 1,
    row: 3,
    col: 6,
},
{
    ip: CONTROLLERS[2],
    strip: 2,
    seq: 2,
    row: 5,
    col: 6,
},
{
    ip: CONTROLLERS[2],
    strip: 2,
    seq: 3,
    row: 7,
    col: 6,
},

]

exports.CONTROLLERS = CONTROLLERS;
exports.SEGMENTS = SEGMENTS;
