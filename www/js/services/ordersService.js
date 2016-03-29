angular.module('restaurantApp.services')
	.service('ordersService', OrdersService);

function OrdersService (apiService, logInService, $window) {
	this.apiService = apiService;
	this.logInService = logInService;
	this.$window = $window;

	this.orders = {
		'unconfirmed' : [
			{
				id: 12345,
				customerName: 'Herp Derpington',
				pickUp: '6:30pm',

			}
		],
		'confirmed' : [
			{
				id: 54321,
				customerName: 'Blurb Blurdington',
				pickUp: '7:00pm'
			}
		]
	};
}

/**
 * Gets the orders for the restaurant
 *@returns{Promise<Object>}
 */
OrdersService.prototype.getOrders = function () {
	var self = this;

	var place_id = JSON.parse(this.$window.localStorage.getItem('place_id')) || this.logInService.place_id || 5;

	var url = 'foodcannon/api/1/place/' + place_id + '/orders/';

	return this.apiService.get(url).then(function(data){
		self.orders = data;
		return data;
	});
};

