angular.module('restaurantApp.services')
	.service('placeService', PlaceService);

function PlaceService (apiService, $window) {
	this.apiService = apiService;
	this.$window = $window;
}

PlaceService.prototype.getStatus = function () {
	var place_id = JSON.parse(this.$window.localStorage.getItem('place_id')) || this.logInService.place_id || 5;

	var placeUrl = "";

	return this.apiService.get(placeUrl).then(function(result){
		console.log('placeResult', result);
		return result;
	})
};

PlaceService.prototype.requestHelp = function () {

	var placeUrl = "";

	console.log('Requested Help!!!');

	/*return this.apiService.post(placeUrl).then(function(result){
		return result;
	});*/
};