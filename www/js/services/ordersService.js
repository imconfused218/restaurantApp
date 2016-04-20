angular.module('restaurantApp.services')
	.service('ordersService', OrdersService);

function OrdersService (apiService, logInService, $window, $interval) {
	this.apiService = apiService;
	this.logInService = logInService;
	this.$window = $window;

	this.ordersUrl = '';
	this.orders = {};

	
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
 * @param{object} order
 * @returns{Promise<Object>}
 */
OrdersService.prototype.confirmOrder = function (order) {
	var self = this;
	var confirmUrl = this.ordersUrl + order.id +'/confirm/';

	return this.apiService.post(confirmUrl).then(function(result){
		return result;
	});
};

/**
 * Sends message that order is finished and ready for pick up
 * @param{object} order
 * @returns{Promise<Object>}
 */
OrdersService.prototype.orderReady = function (order) {
	var self = this;
	var readyUrl = this.ordersUrl + order.id + '/ready/';

	return this.apiService.post(readyUrl).then(function(result){
		return result;
	});
};

/**
 * Sends help request to the server
 * @param{object} order
 * @returns{Promise<Object>}
 */
OrdersService.prototype.requestHelp = function (order) {
	var helpUrl = this.ordersUrl + order.id + '/help/';

	return this.apiService.post(helpUrl).then(function(result){
		return result;
	});
};

