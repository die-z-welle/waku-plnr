angular.module('wakuplnr', ['ngResource'])
.controller('MainCtrl', function($scope, UserService, EventService) {
    $scope.users = UserService.find();
    $scope.events = EventService.find();
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
});
