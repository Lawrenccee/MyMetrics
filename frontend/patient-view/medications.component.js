angular.
  module('patientView').
  component('medications', {
    templateUrl: 'patient-view/medications.template.html',
    bindings: {
      patient: '=',
      medication: '=',
      addMedication: '&',
      removeMedication: '&',
    },
    controller: function ($http) {
      console.log(this.patient);

      this.$onInit = () => {
        this.addMedication = (medication) => {
          let index = this.patient.medications.indexOf(medication);

          if (index < 0 && medication && medication.length > 0) {
            this.patient.medications.push(medication);

            $http({
              method: "PUT",
              url: `/api/users/${this.patient.id}`,
              data: { userInfo: { medications: this.patient.medications } }
            }).then(
              r => {
                this.patient.medications = r.data.medications;
              },
              e => console.log(e)
            );
          }

          this.medication = "";
        };

        this.removeMedication = (medication) => {
          let index = this.patient.medications.indexOf(medication);

          if (index > -1) {
            this.patient.medications.splice(index, 1);

            $http({
              method: "PUT",
              url: `/api/users/${this.patient.id}`,
              data: { userInfo: { medications: this.patient.medications } }
            }).then(
              r => {
                this.patient.medications = r.data.medications;
              },
              e => console.log(e)
            );
          }
        };
      };

    }
  });