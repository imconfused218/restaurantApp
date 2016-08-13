

angular.module('restaurantApp', ['ionic','ionic.service.core','ionic.service.push', 'restaurantApp.controllers', 'restaurantApp.services'])

.run(function($window, $ionicPlatform, $ionicSideMenuDelegate, $ionicPush, $state, $ionicLoading) {
  $ionicPlatform.ready(function() {

    var self = this;
    this.$window = $window;
    this.$ioncLoading = $ionicLoading;

    //disables sidemenu but not working correctly
    $ionicSideMenuDelegate.canDragContent(false);

    //for auto updating 
    var deploy = new Ionic.Deploy();

    deploy.check().then(function(isDeployAvailable) {
      // isDeployAvailable will be true if there is an update
      // and false otherwise
      if (isDeployAvailable) {
        self.$ioncLoading.show({
          template: 'Updating..'
        })
      }
    }, function(deployCheckError) {
      // unable to check for deploy updates
      self.$ionicLoading.hide();
    });

    deploy.update().then(function(deployResult) {
      // deployResult will be true when successfull and
      // false otherwise
      self.$ionicLoading.hide();
      console.log('deployResult', deployResult);
    }, function(deployUpdateError) {
      console.log('deployUpDateError', deployUpDateError);
      // fired if we're unable to check for updates or if any 
      // errors have occured.
      self.$ionicLoading.hide();
    }, function(deployProgress) {
      // this is a progress callback, so it will be called a lot
      // deployProgress will be an Integer representing the current
      // completion percentage.
      self.$ionicLoading.hide();
    });

    //push notification config
    var push = new Ionic.Push({
      "debug": true,
      'onNotification': function(notification) {
        var payload = notification.payload;
        $state.go('newOrderScreen');
      },
      "pluginConfig": {
        "ios": {
          "badge": true,
          "sound": true,
          "alert": true
        }
      }
    });

    push.register(function(token) {
      self.$window.localStorage['device_token'] = JSON.stringify(token.token);
      push.saveToken(token);
    });

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