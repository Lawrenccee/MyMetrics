angular.
  module('patientSignUp').
  component('patientSignUp', {
    templateUrl: 'session/patient-sign-up.template.html',
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
