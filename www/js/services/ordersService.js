angular.module('restaurantApp.services')
	.service('ordersService', OrdersService);

function OrdersService (apiService, logInService, $window, $interval) {
	this.apiService = apiService;
	this.logInService = logInService;
	this.$window = $window;
	this.$interval = $interval;

	this.ordersUrl = '';
	this.orders = {};

	this.intervalInstance;
	this.startCheckingForOrders();
}

/**
 * Gets the orders for the restaurant
 *@returns{Promise<Object>}
 */
OrdersService.prototype.getOrders = function () {
	var self = this;

	var place_id = JSON.parse(this.$window.localStorage.getItem('place_id')) || this.logInService.place_id || 5;

	var ordersUrl = 'foodcannon/api/1/place/' + place_id + '/orders/';

	this.ordersUrl = ordersUrl;

	return this.apiService.get(ordersUrl).then(function(data){
		self.orders = data;
		return data;
	});
};

/**
 * Confirms the order has been processed
 * @param {object} order
 */
OrdersService.prototype.confirmOrder = function (order) {
	var confirmUrl = 'confirm/';

	//this.apiService.post(this.ordersUrl + confirmUrl, order.id)
	this.orders.confirmed.push(order);
	console.log('ordersUrl', this.ordersUrl,'orders', this.orders);
};

/**
 * Starts interval that calls getOrders()
 */
OrdersService.prototype.startCheckingForOrders = function () {
	var self = this;

	if (angular.isDefined(this.intervalInstance)){
		return;
	}

	this.intervalInstance = this.$interval(function(){
		//self.getOrders();
		console.log('getOrders!!')
	}, 30000);
};