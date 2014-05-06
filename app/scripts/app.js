'use strict';

var geotrekApp = angular.module('geotrekMobileApp', ['ngRoute', 'ngResource', 'ui.bootstrap.buttons', 'geotrekMobileControllers', 'geotrekMobileServices']);

geotrekApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        redirectTo: '/trek'
    }).
    when('/trek', {
        templateUrl : 'views/trek_list.html',
        controller: 'TrekListController'
    }).
    when('/trek/:trekId', {
        templateUrl : 'views/trek_detail.html',
        controller: 'TrekController'
    }).
    when('/map', {
        templateUrl : 'views/global_map.html',
        controller: 'MapController'
    }).
    when('/map/:trekId', {
        templateUrl : 'views/global_map.html',
        controller: 'MapController'
    }).
    otherwise({
        redirectTo : '/'
    });

}]);
