

angular.module('restaurantApp', ['ionic', 'restaurantApp.controllers', 'restaurantApp.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('logIn', {
      url: '/logIn',
      templateUrl: 'templates/logIn.html',
      controller: 'logInCtrl as logInCtrl'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.orders', {
      url: '/orders',
      views: {
        'menuContent': {
          templateUrl: 'templates/orders.html',
          controller: 'ordersCtrl as orders',
          resolve : {
            getInitialOrders : function(ordersService) {
              return ordersService.getOrders();
            }
          }
        }
      }
    });
    $urlRouterProvider.otherwise('/logIn');
});