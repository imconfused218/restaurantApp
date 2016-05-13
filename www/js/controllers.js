angular.module('restaurantApp.controllers', ['restaurantApp.services', 'restaurantApp.directives'])

.controller('AppCtrl', AppCtrl)
.controller('logInCtrl', LogInCtrl)
.controller('ordersCtrl', OrdersCtrl)
.controller('newOrderCtrl', NewOrderCtrl);

//////////////////////////////// Abstract App Controller//////////////////

function AppCtrl ($ionicPopover, $scope, placeService, $ionicModal) {
  var self = this;
  this.placeService = placeService;

  //Create popOver from template
  $ionicPopover.fromTemplateUrl('templates/statusOptions.html', {
    scope: $scope
  }).then(function(popover) {
    self.popover = popover;
  });

  //create modal
  $ionicModal.fromTemplateUrl('templates/requestBagsMessage.html',{
    scope: $scope
  }).then(function(modal){
    self.modal = modal;
  });

  //For cleaning up the help modal from the DOM
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


}

/**
 * Requests more bags
 */
AppCtrl.prototype.requestMoreBags = function () {
  var self = this;
  return this.placeService.requestMoreBags().then(function(result){
    self.modal.show();
    return result;
  });
};

/**
 * for removing the modal
 */
AppCtrl.prototype.closeModal = function () {
  this.modal.remove();
};
/**
 * returns currentStatus from place service
 */
AppCtrl.prototype.currentStatus = function () {
  return this.placeService.currentStatus;
};

AppCtrl.prototype.setStatus = function (status) {
  this.popover.hide();
  return this.placeService.postStatus(status).then(function(result){
    return result;
  })
};

///////////////////////////////////// Log In Controller ////////////////////////////
function LogInCtrl (logInService, $ionicLoading, $window, $state) {
  this.logInService = logInService;
  this.$ionicLoading = $ionicLoading;
  this.$window = $window;
  this.$state = $state;

  if (this.$window.localStorage['setHeaders'] && this.$window.localStorage['device_token']) {
    this.$state.go('app.orders')
  }

  this.showPlaceIdField = false;

  this.logInInfo = {
    email : "",
    password: "",
    place_id: ""
  }
}


/**
 * Takes user credentials and calls the logMeIn function rom the logInService
 * @returns{Promise<Object>}
 */
LogInCtrl.prototype.logMeIn = function () {
  var self = this;

  this.logInInfo['device_token'] = JSON.parse(this.$window.localStorage.getItem("device_token"))

  //Show the Ionic Loading screen
  this.$ionicLoading.show();

  this.logInService.logMeIn(this.logInInfo).then(function(result) {
    if (result.place_id === "") {
      self.showPlaceIdField = true;
      self.$ionicLoading.hide();
    } else {
      self.$ionicLoading.hide();
      self.$state.go('app.orders')
    }
  });
};

/////////////////////////////////// Orders Controller//////////////////////////////
function OrdersCtrl (ordersService, $ionicLoading, $ionicModal, $scope, $interval, $ionicPopover, $ionicPlatform, $window, placeService) {
  var self = this;
  this.ordersService = ordersService;
  this.$ionicModal = $ionicModal;
  this.$scope = $scope;
  this.$interval = $interval;
  this.$ionicPopover = $ionicPopover;
  this.$ionicLoading = $ionicLoading;
  this.$ionicPlatform = $ionicPlatform;
  this.$window = $window;
  this.placeService = placeService;

  //disables back button on orders screen
  this.$ionicPlatform.registerBackButtonAction(function (event){
    event.preventDefault();
  }, 100);


  this.orderOptionsEnabled = false;

  this.selectedOrder = this.selectInitialOrder();

  this.intervalInstance;

  this.startCheckingForOrders();

  //For cleaning up the help modal from the DOM
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });



}

/**
 * Shows the order details for the selected order
 * @param{Object} order
 */
OrdersCtrl.prototype.selectOrder = function (order) {

  this.orderOptionsEnabled = false;
  this.selectedOrder = order;
};

/**
 * Calls the confirm order function on ordersService
 */
OrdersCtrl.prototype.confirmOrder = function () {
  var self = this;

  //Show the Ionic Loading screen
  this.$ionicLoading.show();

  this.ordersService.confirmOrder(this.selectedOrder).then(function(result) {
    self.$ionicLoading.hide();
    self.getOrders();
  });
};

/**
 * Calls the order ready function on ordersService
 */
 OrdersCtrl.prototype.orderReady = function () {
  var self = this;

  //Show the Ionic Loading screen
  this.$ionicLoading.show();

  this.ordersService.orderReady(this.selectedOrder).then(function(result) {
    self.$ionicLoading.hide()
    self.getOrders();
  });
 };

/**
 * If there are any active orders it will return one or return false
 * @returns{Object|Boolean} An order object or false
 */ 
OrdersCtrl.prototype.selectInitialOrder = function () {
  return this.ordersService.orders.unconfirmed[0] || this.ordersService.orders.confirmed[0] || this.ordersService.orders.ready[0] || false;
};


/**
 * Sends request to server asking for a call. Opens modal letting them know help is on the way
 */
OrdersCtrl.prototype.requestHelp = function (order) {
  var self = this;
  this.ordersService.requestHelp(order);
  this.$ionicModal.fromTemplateUrl('templates/requestHelpModal.html', {
    scope: this.$scope
  }).then(function(modal){
    self.modal = modal;
    self.modal.show();
  });
};

OrdersCtrl.prototype.closeModal = function () {
  this.modal.remove();
};

/**
 * every 30s
 */
OrdersCtrl.prototype.getOrders = function () {
  var self = this;

  this.ordersService.getOrders().then(function(result){
    self.selectedOrder = self.selectInitialOrder();
  })
};

/**
 * Starts interval that calls getOrders()
 */
OrdersCtrl.prototype.startCheckingForOrders = function () {
  var self = this;

  if (angular.isDefined(this.intervalInstance)) {
    return;
  }

  this.intervalInstance = this.$interval(function(){
    self.getOrders();
  }, 30000);
};

/**
 * Takes an order and returns the total number of items in order
 * @param{Object} order
 * @returns{Number}
 */
OrdersCtrl.prototype.findTotalItems = function (order) {
  if (!order) {return;}
  var count = 0;
  for (var i = 0; i < order.items.length; i++) {
    count += order.items[i].quant;
  }
  return count;
};

/**
 * Takes an order and returns a background color depeding on status and selected
 * @param{Object} order
 * @returns{Object}
 */
 OrdersCtrl.prototype.getColor = function (order) {
  if (!order) {return;}
  if (order === this.selectedOrder) {
    if (order.status == 'unconfirmed') {
      return {'background-color': 'hsla(357, 100%, 67%, 1)',
              'margin-left': '1em'}
    } else if (order.status == 'confirmed') {
      return {'background-color': 'hsla(20, 100%, 62%, 1)',
              'margin-left': '1em'}
    } else if (order.status == 'ready') {
      return {'background-color': 'hsla(147, 100%, 37%, 1)',
              'margin-left': '1em'}
    }
  } else {
    if (order.status == 'unconfirmed') {
      return {'background-color': 'hsla(357, 100%, 84%, 1)'}
    } else if (order.status == 'confirmed') {
      return {'background-color': 'hsla(24, 100%, 75%, 1)'}
    } else if (order.status == 'ready') {
      return {'background-color': 'hsla(119, 100%, 79%, 1)'}
    }
  }
 };


 /**
  * Gets the viewport size and uses that as the minimium height for the page
  * @returns{Object} -CSS for the height
  */
 OrdersCtrl.prototype.getWindowSize = function () {
  var height = this.$window.innerHeight;
  return {"min-height": height}
 };

/********************************** New Order Controller *****************/

function NewOrderCtrl ($state) {
  this.$state = $state;
}


NewOrderCtrl.prototype.clickScreen = function () {
  this.$state.go('app.orders');
};
