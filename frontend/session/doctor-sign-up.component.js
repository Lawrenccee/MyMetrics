angular.
  module('doctorSignUp').
  component('doctorSignUp', {
    templateUrl: 'session/doctor-sign-up.template.html',
    controller: function ($http) {

      this.sendUser = () =>
        (
          $http({
            method: "POST",
            url: '/api/users',
            data: { user: this.user }
          }).then(r => console.log(r))
        )
      }
    });
