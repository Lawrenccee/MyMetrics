angular.
  module('patientSignUp').
  component('patientSignUp', {
    templateUrl: 'session/patient-sign-up.template.html',
    controller: function ($http) {

      this.sendUser = () => {
        // $http({
        //   method: 'POST',
        //   url: '/api/users',
        //   headers: {
        //     "Content-Type": "application/json"
        //   },
        //   dataType: 'json',
        //   data: { user: this.user }
        // });
      };
    }
  });

