angular.module('expressWuApp')

.config(function($stateProvider){
  $stateProvider
  .state('main.registration',{
    url : '^/registration',
    views: {
      'main-content' : {
        templateUrl : 'views/registration.html',
        controller: 'regCtrl'
      }
    }
  })
})

.controller('regCtrl', function($scope){
  console.log('aa');
});
