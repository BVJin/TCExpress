angular.module('expressWuApp')

  .config(function ($stateProvider) {
    $stateProvider
      .state('main.login', {
        url: '^/login',
        views: {
          'main-content': {
            templateUrl: '../../views/login.html',
            controller: 'loginCtrl'
          }
        }
      })
  })

  .controller('loginCtrl', function ($scope) {

  });
