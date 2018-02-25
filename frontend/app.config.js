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
          when('/splashpage', {
            template: '<splash-page></splash-page>',
            auth: false
          }).
          when('/doctorsignup', {
              template: '<doctor-sign-up></doctor-sign-up>',
              auth: false
          }).
          when('/patientsignup', {
              template: '<patient-sign-up></patient-sign-up',
              auth: false
          }).
        when('/patientview', {
            template: '<patient-view></patient-view>',
            auth: true
        }).
        when('/doctorview', {
            template: '<doctor-view></doctor-view>',
            auth: true
        }).
        when('/login', {
            template: '<log-in></log-in>',
            auth: false
        }).
        otherwise('/splashpage');
      }
  ]).run(['$rootScope', '$route', '$location', 'UserService', function($rootScope, $route, $location, UserService) {
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
      let user = JSON.parse(UserService.getStore());

      if (!$route.routes[$location.path()]) {
        return;
      }

      if ($route.routes[$location.path()].auth === true && (!user || !user.email)) {
        event.preventDefault();
        $location.path('/login');
      } else if ($route.routes[$location.path()].auth === false && user && user.email) {
        event.preventDefault();

        if (user.isDoctor) {
          $location.path('/doctorview');
        } else {
          $location.path('/patientview');
        }
      } else if ($route.routes[$location.path()].auth === true && user && user.email) {
        if (user.isDoctor) {
          $location.path('/doctorview');
        } else {
          $location.path('/patientview');
        }
      }
    });
  }]
);




