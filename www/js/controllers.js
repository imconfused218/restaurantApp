angular.module('restaurantApp.controllers', ['restaurantApp.services', 'restaurantApp.directives'])

.controller('AppCtrl', function() {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
})
.controller('logInCtrl', LogInCtrl)
.controller('ordersCtrl', OrdersCtrl);

///////////////////////////////////// Log In Controller ////////////////////////////
function LogInCtrl (logInService, $ionicLoading, $window, $state) {
  this.logInService = logInService;
  this.$ionicLoading = $ionicLoading;
  this.$window = $window;
  this.$state = $state;

  if (this.$window.localStorage['setHeaders']){
    this.$state.go('app.orders')
  }

  this.logInInfo = {
    email : "matt@menu.me",
    password: "handsoff9"
  }
}


/**
 * Takes user credentials and calls the logMeIn function rom the logInService
 * @returns{Promise<Object>}
 */
LogInCtrl.prototype.logMeIn = function () {
  var self = this;

  //Show the Ionic Loading screen
  this.$ionicLoading.show();

  this.logInService.logMeIn(this.logInInfo).then(function(result) {
    self.$ionicLoading.hide();
    self.$state.go('app.orders')
  })
};

/////////////////////////////////// Orders Controller//////////////////////////////
function OrdersCtrl (ordersService) {
  this.ordersService = ordersService;

  this.orders = this.ordersService.orders;

  this.selectedOrder = this.orders.unconfirmed[0] || this.orders.confirmed[0] || this.orders.ready[0] || {};
}

OrdersCtrl.prototype.selectOrder = function (order) {
  this.selectedOrder = order;
}

OrdersCtrl.prototype.confirmOrder = function () {
  this.ordersService.confirmOrder(this.selectedOrder);
}


