angular.
  module('patientView').
  component('patientView', {
    templateUrl: 'patient-view/patient-view.template.html',
    controller: function ($routeParams, $http) {
      // do something to fetch the user's id/email from the route params

      // set user to that user so we can show it in the html
      // for now it will be a fake user
      this.patient = {
        name: "Sam Uchiha"
      };

      this.date = new Date();

      this.updatePatient = () => {
        console.log(this.patient);
      };
    }
  });