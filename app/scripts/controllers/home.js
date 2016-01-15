angular.module('expressWuApp')

.config(function($stateProvider){
  $stateProvider
  .state('main.home',{
    url : '^/home',
    views: {
      'main-content' : {
        templateUrl : 'views/home.html',
        controller: 'homeCtrl'
      }
    }
  })
})

.controller('homeCtrl', function($scope){
  console.log('aa');
});
