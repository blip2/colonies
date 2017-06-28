// dots and boxes installation
// server interface
// Ben Hussey - May 2017

// Controller IPs defined here
var CONTROLLER_1 = "192.168.10.101"
var CONTROLLER_2 = "192.168.10.102"
var CONTROLLER_3 = "192.168.10.103"
var CONTROLLER_4 = "192.168.10.104"
var CONTROLLER_5 = "192.168.10.105"
var CONTROLLER_6 = "192.168.10.106"

// Segment map defined below
// Each row and col should be assigned to a controller strip and sequence
// Blocks should not be assigned to controllers (odd columns in odd rows)
var SEGMENTS = [
{
    ip: CONTROLLER_1,
    strip: 0,
    seq: 0,
    row: 0,
    col: 0,
},
{
    ip: CONTROLLER_1,
    strip: 0,
    seq: 1,
    row: 0,
    col: 1,
},
{
    ip: CONTROLLER_1,
    strip: 0,
    seq: 2,
    row: 0,
    col: 2,
},
{
    ip: CONTROLLER_1,
    strip: 0,
    seq: 3,
    row: 0,
    col: 3,
},
{
    ip: CONTROLLER_1,
    strip: 1,
    seq: 0,
    row: 2,
    col: 0,
},
{
    ip: CONTROLLER_1,
    strip: 1,
    seq: 1,
    row: 2,
    col: 1,
},
{
    ip: CONTROLLER_1,
    strip: 1,
    seq: 2,
    row: 2,
    col: 2,
},
{
    ip: CONTROLLER_1,
    strip: 1,
    seq: 3,
    row: 2,
    col: 3,
},
{
    ip: CONTROLLER_1,
    strip: 2,
    seq: 0,
    row: 4,
    col: 0,
},
{
    ip: CONTROLLER_1,
    strip: 2,
    seq: 1,
    row: 4,
    col: 1,
},
{
    ip: CONTROLLER_1,
    strip: 2,
    seq: 2,
    row: 4,
    col: 2,
},
{
    ip: CONTROLLER_1,
    strip: 2,
    seq: 3,
    row: 4,
    col: 3,
},

]

exports.SEGMENTS = SEGMENTS;
