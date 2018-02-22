const app = angular.module('myMetricsApp', ['ngRoute', 'logIn', 'patientSignUp', 'doctorSignUp', 'patientView', 'doctorView']);

// app.run(['$rootScope', '$location', 'UserService', function ($rootScope, $location, UserService) {
//   $rootScope.$on('$routeChangeStart', function (event) {
//     let user = JSON.parse(UserService.getStore());
//     // console.log(user);

//     if (!user || !user.email) {
//       $location.path('/login');
//     }
//     // else {
//     //   $location.path('/patientview');
//     // }
//   });
// }]);
