angular.
  module('doctorSignUp').
  component('doctorSignUp', {
    templateUrl: 'session/doctor-sign-up.template.html',
    controller: function ($http, UserService, $window) {
      this.sendUser = () =>
        {
          $http({
            method: "POST",
            url: '/api/users',
            data: { user: this.user }
          }).then(r => {
              UserService.setStore(r.data);
              $window.location.href = '#!/doctorview';
            });
        };
      }
    });
