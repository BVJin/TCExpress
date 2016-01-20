angular.module('expressWuApp')

.config(function($stateProvider){
  $stateProvider
  .state('main.register',{
    url : '^/register',
    views: {
      'main-content' : {
        templateUrl : '../../views/register.html',
        controller: 'regCtrl'
      }
    }
  })
})

.controller('regCtrl', function($scope){
  
});
