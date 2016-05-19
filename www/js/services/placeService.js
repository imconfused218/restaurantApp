angular.module('restaurantApp.services')
	.service('placeService', PlaceService);

function PlaceService (apiService, $window, logInService) {
	this.apiService = apiService;
	this.$window = $window;
	this.logInService = logInService;

	this.currentStatus;

	this.currentPlace;
}

/**
 * Asks Server for status on restaurant I.E open for orders or closed.
 * @returns{Promise<Object>}
 */
PlaceService.prototype.getStatus = function () {
	var self = this;

	var place_id = JSON.parse(this.$window.localStorage.getItem('place_id')) || this.logInService.place_id || 5;

	var placeUrl = "foodcannon/api/1/place/" + place_id + "/status/";

	return this.apiService.get(placeUrl).then(function(result){
		console.log('placeResult', result);
		self.currentStatus = result.status;
		self.currentPlace = result.name;
		return result;
	});
};

/**
 * Tells Server status on restaurant I.E open for orders or closed.
 * @returns{Promise<Object>}
 */
PlaceService.prototype.postStatus = function (status) {
	var status = status;

	var place_id = JSON.parse(this.$window.localStorage.getItem('place_id')) || this.logInService.place_id || 5;

	var placeUrl = "foodcannon/api/1/place/" + place_id + "/status/" + status + "/";

	return this.apiService.post(placeUrl).then(function(result){
		self.currentStatus = result.status;
		console.log('placeResult', result);
		return result;
	});
};

PlaceService.prototype.requestMoreBags = function () {

	var place_id = JSON.parse(this.$window.localStorage.getItem('place_id')) || this.logInService.place_id || 5;

	var placeUrl = "foodcannon/api/1/place/" + place_id + "/bags/";

	return this.apiService.post(placeUrl).then(function(result){
		return result;
	})
};