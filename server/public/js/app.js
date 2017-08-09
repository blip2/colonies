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

app.controller('segments', function ($scope, $filter, $window, socket) {

  var player = 1;
  $scope.state = "Creative";
  $scope.colour = "#FF0000";

  $scope.colours = ['#D63F15', '#0F5573', '#FA9B1E', '#D22D7D', '#1982AF', '#28AF73', '#CCCCCC', '#000000'];
  $scope.states = ['Creative', 'Game', 'Demo'];

  angular.element($window).on('resize', function () {
    $scope.updateDims();
    $scope.$apply()
  });

  $scope.updateDims = function() {
    var total = Math.min($window.innerWidth - 33, 1000)

    var approx = total / 7.2
    var space = Math.max(12, approx*0.15)

    var block = (total - 8 * space) / 7

    for(var i=0; i < $scope.segments.length; i++){
      var p = $scope.segments[i];
      if (p.type == 'block') {
        p.width = block
        p.height = block
      }
      if (p.type == 'vert') {
        p.width = space
        p.height = block
      }
      if (p.type == 'horiz') {
        p.width = block
        p.height = space
        p.margin = space
      }
    }
  }

  socket.on('segments', function (data) {
    $scope.segments = data;
    $scope.updateDims();
  });

  socket.on('segment-change', function (data) {
    $scope.update_segment(data);
  });

  socket.on('state', function (value) {
    $scope.state = value;
  });

  $scope.update_segment = function(segment) {
    var found = $filter('getById')($scope.segments, segment.id);
    var index = $scope.segments.indexOf(found);
    $scope.segments[index] = segment;
    $scope.updateDims();
  };

  $scope.segmentClick = function(segment) {
    if ($scope.state == "Game") {
      if (segment.type != 'block' && segment.color == '#000000') {
        if (player == 1) {
          segment.color = $scope.colour;
          player = 2;
        } else {
          segment.color = $scope.player2;
          player = 1;
        }
        socket.emit('segment-change', segment);
      }
    } else {
      console.log(segment)
      if (segment.type != 'block') {
        segment.color = $scope.colour;
        socket.emit('segment-change', segment);
      };
    };
  };

  $scope.setState = function(state) {
    $scope.state = state;
    if (state == "Game") {
      $scope.reset();
    }
    socket.emit('state', $scope.state);
    console.log($scope.state)
  }

  $scope.setColour = function(colour) {
    $scope.colour = colour;
    if ($scope.state == "Game") {
      // login as player
    }
    console.log($scope.colour)
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
