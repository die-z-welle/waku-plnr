angular.module('wakuplnr', ['ngResource'])
.controller('MainCtrl', function($scope, UserService, EventService) {
    $scope.users = UserService.find();
    $scope.events = EventService.find();
    $scope.logme = function() {
        console.log($scope.userid);
        console.log($scope.day);
        console.log($scope.startTime + ' - ' + $scope.endTime);
    };
    
    $scope.saveEvent = function() {
        console.log('implement save event');
        var dayParts = $scope.day.split('.');
        var startTimeParts = $scope.startTime.split(':');
        var endTimeParts = $scope.endTime.split(':');
        var start = new Date(dayParts[2], dayParts[1] - 1, dayParts[0], startTimeParts[1], startTimeParts[0]);
        var end = new Date(dayParts[2], dayParts[1] - 1, dayParts[0], endTimeParts[1], endTimeParts[0]);
        // TODO generate id
        var event = {from: start, to: end, user_id: $scope.userid};
        EventService.create(event);
    };
})
.service('UserService', function($resource) {
    return $resource('/users/:id', {}, {
        find: {
            method: 'GET',
            params: {
                id: '@id'
            },
            isArray: true
        },
        findById: {
            method: 'GET',
            params: {
                id: '@id'
            }
        },
        create: {
            method: 'POST'
        }
    });
})
.service('EventService', function($resource) {
    return $resource('/events/:id', {}, {
        find: {
            method: 'GET',
            isArray: true
        },
        findById: {
            method: 'GET',
            params: {
                id: '@id'
            }
        },
        create: {
            method: 'POST'
        },
        delete: {
            method: 'DELETE',
            params: {
                id: '@id'
            }
        }
    });
})
.directive('wakuDate', function($timeout){
  return {
    restrict: 'E',
    templateUrl: 'datepicker.html',
    scope: {
      eventHandler: '&eventHandler',
      value: '=',
      required: '=',
      name: '=',
      limitValue: '=limitValue',
      limit: '@limit'
    },

    link: function(scope, element, attrs){
      element.find('.input-group.date').datepicker({
        format: "dd.mm.yyyy",
        "todayBtn": "linked",
        todayHighlight: true,
        "autoclose": true
      });

      element.find('.input-group.date').datepicker('update', scope.value);

      scope.valueChanged = function(){
        $timeout(function() {
          scope.eventHandler();
        }, 1);
      };
      scope.$watch('limitValue', function(val){

        if(scope.limit === 'endDate'){
          element.find('.input-group.date').datepicker('setEndDate', val);
        }

        if(scope.limit === 'startDate'){
          element.find('.input-group.date').datepicker('setStartDate', val);
        }

      });

      scope.openDatepicker = function(){
        element.find('.input-group.date').datepicker('show');
      };
    }
  };
})
.directive('wakuTime', function($timeout){
  return {
    restrict: 'E',
    templateUrl: 'timepicker.html',
    scope: {
      eventHandler: '&eventHandler',
      value: '=',
      required: '=',
      name: '='
    },

    link: function(scope, element, attrs){

      scope.openClockPicker = function($event){
        $event.stopPropagation();
        element.find('.clockpicker').clockpicker('show');
      };

      scope.valueChanged = function () {
        $timeout(function() {
          scope.eventHandler();
        }, 1);
      };

      element.find('.clockpicker').clockpicker({
        autoclose: true
      });
    }
  };
});