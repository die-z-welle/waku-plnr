angular.module('wakuplnr', ['ngResource', 'ui.calendar'])
.controller('MainCtrl', function($scope, UserService, EventService, uiCalendarConfig) {
    $scope.users = UserService.find();
    $scope.events = EventService.find();
    $scope.findUserById = function(userId) {
        return $scope.users.find(function(user) { return userId === user._id; });
    };

    $scope.uiConfig = {
        calendar:{
            height: 450,
            editable: true,
            defaultView: 'agendaWeek',
            allDaySlot: false,
            header:{
                left: 'month agendaWeek agendaDay',
                center: 'title',
                right: 'prev today next'
            }
            //,
            // dayClick: $scope.alertEventOnClick,
            // eventDrop: $scope.alertOnDrop,
            // eventResize: $scope.alertOnResize
        }
    };

    /* Change View */
    $scope.changeView = function(view, calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    
    /* Change View */
    $scope.renderCalender = function(calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
        
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [];
        EventService.find({startdate: start, enddate: end}).$promise.then(function(result) {
            console.log(JSON.stringify(result));
            result.forEach(function(event) {
                var user = $scope.findUserById(event.user_id);
                var userName = (user) ? (user.firstname + ' ' + user.lastname) : 'Namenlos';
                events.push({
                    title: userName,
                    start: event.from,
                    end: event.to,
                    allDay: false
                });
            });
            callback(events);
        });
    };

    $scope.eventSources = [ $scope.eventsF ];
})
.controller('EventCtrl', function($scope, UserService, EventService) {
    $scope.users = UserService.find();
    $scope.logme = function() {
        console.log($scope.userid);
        console.log($scope.day);
        console.log($scope.startTime + ' - ' + $scope.endTime);
    };
    
    $scope.save = function() {
        var dayParts = $scope.day.split('.');
        var startTimeParts = $scope.startTime.split(':');
        var endTimeParts = $scope.endTime.split(':');
        var start = new Date(dayParts[2], dayParts[1] - 1, dayParts[0], startTimeParts[0], startTimeParts[1]);
        var end = new Date(dayParts[2], dayParts[1] - 1, dayParts[0], endTimeParts[0], endTimeParts[1]);
        var event = {from: start, to: end, user_id: $scope.userid};
        EventService.create(event).$promise.then(
            function(success) {
                $scope.success = true;
            }, function (error) {
                $scope.error = error;
            }
        );
    };
})
.controller('UserCtrl', function($scope, UserService) {
    $scope.save = function() {
        UserService.create({firstname: $scope.firstname, lastname: $scope.lastname, twitter_id: $scope.twitterId}).$promise.then(
            function(success) {
                $scope.success = true;
            }, function (error) {
                $scope.error = error;
            }
        );
    }
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