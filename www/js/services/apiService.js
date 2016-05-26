angular.module('restaurantApp.services', [])
      .service('apiService', ApiService);

  /** @ngInject */
  function ApiService($http, $q, $log, $ionicLoading, $window, $ionicPopup) {
    this.$http = $http;
    this.$q = $q;
    this.$log = $log;
    this.$ionicLoading = $ionicLoading;
    this.$window = $window;
    this.$ionicPopup = $ionicPopup;

    this.hostUrl = 'https://sandbox.menu.me/';
    this.auth = "Token BC04DM5Q-Qjlzk9SrtoZRCcRvbYYsomuVUuqzO8yHi3vl9jS7sKhBd3bRTl7ELhKwmrfpXeqXQQZC";

    this.setHeaders = {
    	"Authorization": this.auth,
      "Content-Type": 'text/plain'
    }


  }

  ApiService.prototype.get = function(url, content, optional_httpSettings) {
    optional_httpSettings = optional_httpSettings || {};
    var settings = angular.extend(optional_httpSettings, {
      method: 'get',
      url: url,
      params: content
    });
    return this.apiCall_(settings);
  };

  // For creates.
  ApiService.prototype.post = function(url, content, optional_httpSettings) {
    optional_httpSettings = optional_httpSettings || {};
    var settings = angular.extend(optional_httpSettings, {
      method: 'post',
      url: url,
      data: content
    });
    return this.apiCall_(settings);
  };

  // For updates.
  ApiService.prototype.put = function(url, content, optional_httpSettings) {
    optional_httpSettings = optional_httpSettings || {};
    var settings = angular.extend(optional_httpSettings, {
      method: 'put',
      url: url,
      data: content
    });
    return this.apiCall_(settings);
  };

  // For deletes.
  ApiService.prototype.delete = function(url, content, optional_httpSettings) {
    optional_httpSettings = optional_httpSettings || {};
    var settings = angular.extend(optional_httpSettings, {
      method: 'delete',
      url: url,
      params: content
    });
    return this.apiCall_(settings);
  };


  ApiService.prototype.apiCall_ = function(httpSettings) {
  	var self = this;
    var settings = httpSettings;
    settings.url = this.hostUrl + httpSettings.url;
    settings.headers = JSON.parse(this.$window.localStorage.getItem("setHeaders")) || this.setHeaders;

    return this.$http(settings).then(function(response) {
      self.$log.info('apiService-response', response)
      return response.data;
    }, function(err) {
        if (err.status === 422)
        self.$ionicPopup.alert({
          title: "error",
          template: err.data
        });
        self.$ionicLoading.hide()
        self.$log.info(err, 'err');
      // Do all error handling in one place.
        return self.$q.reject(err);
    });
  }