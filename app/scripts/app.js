'use strict';

/**
 * @ngdoc overview
 * @name expressWuApp
 * @description
 * # expressWuApp
 *
 * Main module of the application.
 */
angular
  .module('expressWuApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router'
  ])

  .run(function($state){
    console.log($state);
    console.log($state.current);
  })

  .config(function ($stateProvider,$urlRouterProvider) {
    $stateProvider
      .state('main',{
        url: '/main',
        templateUrl: 'views/main.html'
      });
      $urlRouterProvider.otherwise("/home");
    
  });
