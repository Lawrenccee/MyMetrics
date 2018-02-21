// Layout for our locationProvider which will set the hash-prefix
// to '!'. This prefix will appear in the links to our client side
// routes right after the '#' (hash) symbol and before the actual
// path. (e.g index.html#!/some/path)
// This is not necessary but considered good practice. and 
// '!' is the most commonly used prefix.
angular.
  module('myMetricsApp').
  config(['$locationProvider', '$routeProvider',
      function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
          when('/doctorsignup', {
              template: '<doctor-sign-up></doctor-sign-up>'
          }).
          when('/patientsignup', {
              template: '<patient-sign-up></patient-sign-up'
          }).
          when('/login', {
              template: '<log-in></log-in>'
          }).
          otherwise('/login');
      }
  ]);




