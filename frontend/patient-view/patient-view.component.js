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
        console.log(this.patient);
        
          // Do an http request to grab the patient were on???
          // But how do we know what patient it is...
        $http({
          method: 'GET',
          url: `/api/users/${this.patient.id}`
        }).then((user) => {
          this.patient = user;
        });
      };

      this.patient = {};
      this.patient.symptoms = [];
      this.patient.medications = [];

      this.date = new Date();
      this.nextAppt = new Date();

      this.updatePatient = () => {
        // DO POST REQUEST TO UPDATE PATIENT sending this.patient
      };

      this.logout = () => {
        UserService.clear();
      };

      this.symptoms = [
        "Trouble breathing?",
        "Chest pain?",
        "Swelling in legs?"
      ];

      this.updateSymptoms = (event) => {
        let index = this.patient.symptoms.indexOf(event.target.value);

        if (index > -1) {
          this.patient.symptoms.splice(index, 1);
        } else {
          this.patient.symptoms.push(event.target.value);
        }
      };

      this.addMedication = (medication) => {
        let index = this.patient.medications.indexOf(medication);

        if (index < 0) {
          this.patient.medications.push(medication);
        }

        this.medication = "";
      };

      this.removeMedication = (medication) => {
        let index = this.patient.medications.indexOf(medication);

        if (index > -1) {
          this.patient.medications.splice(index, 1);
        }
      };
    }
  });