angular.module('restaurantApp.services')
	.service('logInService', LogInService);

function LogInService (apiService, $window) {
	this.apiService = apiService;
	this.$window = $window;

	this.rootUrl = 'foodcannon/api/1/auth/';
	this.place_id;
}

/**
 * For logging in the user and obtaining an authorization token
 * @param{object} logInInfo - An object wih user log-in information
 * @returns{Promise<Object>}
 */
LogInService.prototype.logMeIn = function (logInInfo) {
	var self = this;

	return this.apiService.post(this.rootUrl, logInInfo).then(function(result){
		self.place_id = result.place_id;
		self.$window.localStorage['place_id'] = JSON.stringify(self.place_id);
		self.apiService.setHeaders['Bearer'] = result.auth_token;
		self.$window.localStorage['setHeaders'] = JSON.stringify(self.apiService.setHeaders);
		return result;
	});
};