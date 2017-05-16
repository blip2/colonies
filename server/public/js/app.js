// dots and boxes installation
// client interface
// Ben Hussey - May 2017

'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('DotsandBoxes', [
  'btford.socket-io', 'colorpicker-dr'
]).factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.controller('segments', function ($scope, $filter, socket) {

  var player = 1;
  $scope.mode = "normal";
  $scope.player1 = "#FF0000";
  $scope.player2 = "#0000FF";

  socket.on('segments', function (data) {
    $scope.segments = data;
  });

  socket.on('segment-change', function (data) {
    $scope.update_segment(data);
  });

  socket.on('mode', function (value) {
    $scope.mode = value;
  });

  $scope.update_segment = function(segment) {
    var found = $filter('getById')($scope.segments, segment.id);
    var index = $scope.segments.indexOf(found);
    $scope.segments[index] = segment;
  };

  $scope.segmentClick = function(segment) {
    if ($scope.mode == "game") {
      if (segment.type != 'block' && segment.color == '#000000') {
        if (player == 1) {
          segment.color = $scope.player1;
          player = 2;
        } else {
          segment.color = $scope.player2;
          player = 1;
        }
        socket.emit('segment-change', segment);
      }
    } else {
      if (segment.type != 'block') {
        segment.color = $scope.player1;
        socket.emit('segment-change', segment);
      };
    };
  };

  $scope.modeSwitch = function() {
    if ($scope.mode == "game") {
      $scope.mode = "normal";
    } else {
      $scope.mode = "game";
      $scope.reset();
    }
    socket.emit('mode', $scope.mode);
  }

  $scope.reset = function() {
    socket.emit('reset')
  };

});


app.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].id == +id) {
        return input[i];
      }
    }
    return null;
  }
});
