angular.
  module('patientView').
  component('patientView', {
    templateUrl: 'patient-view/patient-view.template.html',
    controller: function ($routeParams, $http, UserService) {
      // do something to fetch the user's id/email from the route params

      this.$onInit = () => {
        // Get the patient stored by the login/signup set in the store
        // TODO: The store gets emptied if the page is refreshed...
        this.patient = UserService.getStore();
      };

      // set user to that user so we can show it in the html
      // for now it will be a fake user
      this.patient = {
        name: "Sam Uchiha",
        weight: 130,
        sodium: 5,
        fluid: 2,
        stage: "5"
      };

      this.date = new Date();

      this.updatePatient = () => {
        console.log(this.patient);
      };
    }
  });