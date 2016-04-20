

angular.module('restaurantApp', ['ionic','ionic.service.core','ionic.service.push', 'restaurantApp.controllers', 'restaurantApp.services'])

.run(function($ionicPlatform, $ionicSideMenuDelegate, $ionicPush, $state) {
  $ionicPlatform.ready(function() {

    $ionicSideMenuDelegate.canDragContent(false);



    var deploy = new Ionic.Deploy();
    deploy.update().then(function(deployResult) {
      // deployResult will be true when successfull and
      // false otherwise
      console.log('deployResult', deployResult);
    }, function(deployUpdateError) {
      console.log('deployUpDateError', deployUpDateError);
      // fired if we're unable to check for updates or if any 
      // errors have occured.
    }, function(deployProgress) {
      // this is a progress callback, so it will be called a lot
      // deployProgress will be an Integer representing the current
      // completion percentage.
    });

    /*
    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:",token.token);
      push.saveToken(token);
    });
    */

    $ionicPush.init({
      "debug": true,
      "onNotification": function(notification) {
        var payload = notification.payload;
        console.log(notification, payload);
        $state.go('newOrderScreen');
      },
      "onRegister": function(data) {
        console.log(data.token);
      }
    });

    $ionicPush.register();


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
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
    .state('newOrderScreen', {
      url: '/newOrder',
      templateUrl: 'templates/incomingOrder.html',
      controller: 'newOrderCtrl as newOrderCtrl'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl as AppCtrl',
      resolve: {
        getInitialStatus : function(placeService) {
          return placeService.getStatus();
        }
      }
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