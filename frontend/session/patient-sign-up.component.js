angular.
  module('patientSignUp').
  component('patientSignUp', {
    templateUrl: 'session/patient-sign-up.template.html',
    controller: function () {

      this.sendUser = () => {
        console.log(this.user);
      };
    }
  });

