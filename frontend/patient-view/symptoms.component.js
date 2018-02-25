angular.
  module('patientView').
  component('symptoms', {
    templateUrl: 'patient-view/symptoms.template.html',
    bindings: {
      patient: '=',
      updatePatient: '&'
    },
    controller: function () {
      this.$onInit = () => {
        this.symptoms = [
          "Trouble breathing",
          "Chest pain",
          "Swelling in legs"
        ];   

        this.updateSymptoms = (symptom) => {
          let index = this.patient.symptoms.indexOf(symptom);

          if (index > -1) {
            this.patient.symptoms.splice(index, 1);
          } else {
            this.patient.symptoms.push(symptom);
          }
        };

        this.symptomExists = (symptom) => {
          if (this.patient.symptoms) {
            return this.patient.symptoms.indexOf(symptom) > -1;
          }
        };
      };

    }
  });