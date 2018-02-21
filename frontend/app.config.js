// Layout for our locationProvider which will set the hash-prefix
// to '!'. This prefix will appear in the links to our client side
// routes right after the '#' (hash) symbol and before the actual
// path. (e.g index.html#!/some/path)
// This is not necessary but considered good practice. and 
// '!' is the most commonly used prefix.


// angular.
//     module('myMetricsApp').
//     config(['$locationProvider', '$routeProvider',
//         function config($locationProvider, $routeProvider) {
//             $locationProvider.hashPrefix('!');

//             $routeProvider.
//                 when('/route', {
//                     template: '<ourtemplate></ourtemplate>'
//                 }).
//                 when('/anotherRoute', {
//                     template: '<anotherTemplate></anotherTemplate'
//                 }).
//                 otherwise('/defaultview');
//         }
//     ]);




