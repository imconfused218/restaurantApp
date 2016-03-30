angular.module('restaurantApp.services')
	.service('placeService', PlaceService);

function PlaceService (apiService) {
	this.apiService = apiService;
}