angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function($scope) {

      $scope.sendUser = () => {
        console.log($scope.user);
        $.ajax({
          method: 'POST',
          url: 'api/users',
          data: {user: $scope.user}
        });
      };
    }
  });

