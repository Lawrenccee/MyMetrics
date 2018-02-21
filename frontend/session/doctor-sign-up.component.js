angular.
  module('doctorSignUp').
  component('doctorSignUp', {
    templateUrl: 'session/doctor-sign-up.template.html',
    controller: function () {

      this.sendUser = () => {
        console.log(this.user);
      };
    }
  });