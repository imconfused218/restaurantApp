angular.module('restaurantApp.directives', [])
	.directive('orderBox', function() {
		return {
			restrict: 'E',
			templateUrl : '/templates/orderBox.html'
		};
	});