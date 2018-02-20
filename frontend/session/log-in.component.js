angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function($scope , $http) {

      $http({
        method: "GET",
        url: "api/users"
      }).then((users) => {
        console.log(users);
      });

      $scope.sendUser = () => {
        console.log($scope.user);
      };
    }
  });

