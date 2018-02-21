function UserService() {
  let service = {};

  // let storage = {};

  service.setStore = function(obj) {
    this.storage = obj;
  };

  service.getStore = function() {
    return this.storage;
  };

  return service;
}

angular.
  module("myMetricsApp").
  factory('UserService', UserService);