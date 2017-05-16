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

  $scope.color = "#FF0000";

  socket.on('segments', function (data) {
    $scope.segments = data;
  });

  socket.on('segment-change', function (data) {
    $scope.update_segment(data);
  });

  $scope.update_segment = function(segment) {
    var found = $filter('getById')($scope.segments, segment.id);
    var index = $scope.segments.indexOf(found);
    $scope.segments[index] = segment;
  };

  $scope.segmentClick = function(segment) {
    if (segment.type != 'block') {
      segment.color = $scope.color;
      socket.emit('segment-change', segment)
    }
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
