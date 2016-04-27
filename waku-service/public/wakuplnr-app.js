angular.module('wakuplnr', ['ngResource'])
.controller('MainCtrl', function($scope, UserService, EventService) {
    $scope.users = UserService.find();
    $scope.events = EventService.find();
    $scope.logme = function() {
        console.log($scope.startDate + ' - ' + $scope.endDate);
    }
    
    $scope.saveEvent = function() {
        console.log('implement save event');
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

});
