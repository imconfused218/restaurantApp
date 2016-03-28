angular.module('restaurantApp.services')
	.service('ordersService', OrdersService);

function OrdersService (apiService) {
	this.apiService = apiService;

	this.restaurantId = 123456;
	this.ordersUrl = '/menuMeOrders';

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
	var url = ordersUrl + '/' + this.restaurantId + '/';
	return this.apiService.get(url).then(function(data){
		self.orders = data;
		return data;
	});
};

