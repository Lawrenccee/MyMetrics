function UserService($window) {
  let service = {};

  service.setStore = function(obj) {
    $window.localStorage.setItem('user', JSON.stringify(obj));
    // this.storage = obj;
  };

  service.getStore = function() {
    return $window.localStorage.getItem('user');
    // return this.storage;
  };

  service.clear = function() {
    $window.localStorage.removeItem('user');
  };

  return service;
}

angular.
  module("myMetricsApp").
  factory('UserService', UserService);