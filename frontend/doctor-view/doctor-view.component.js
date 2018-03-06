angular.
  module('doctorView').
  component('doctorView', {
    templateUrl: 'doctor-view/doctor-view.template.html',
    controller: function ($routeParams, $http, UserService, GraphService, $window) {

      this.$onInit = () => {
        this.doctor = JSON.parse(UserService.getStore());

        $http({
          method: 'GET',
          url: `/api/users/${this.doctor.id}`
        }).then((res) => {
          this.doctor = res.data;
          this.patients = this.doctor.patients;
          this.currentPatient = this.patients[0];
          GraphService.createChart('patient-graph', this.currentPatient.logData);
      
          let weight;
          weight = this.currentPatient.logData.weightLog;
          this.currentWeight = weight[weight.length-1][1];

          let sodium;
          sodium = this.currentPatient.logData.sodiumLog;
          this.currentSodium = sodium[sodium.length-1][1];

          let fluid;
          fluid = this.currentPatient.logData.fluidLog;
          this.currentFluid = fluid[fluid.length-1][1];

          let symptoms;
          symptoms = this.currentPatient.log;
          this.currentSymptoms = symptoms[symptoms.length-1].symptomsEntry;
          
        });
      };

      this.logout = () => {
        $http({
          method: 'DELETE',
          url: '/api/sessions'
        }).then((res) => {
          UserService.clear();
          $window.location.href = '#!/login';
        });

      };


      this.getPatient = (event) => {
        this.currentPatient = JSON.parse(event.target.dataset.patient);

        let weight;
        weight = this.currentPatient.logData.weightLog;
        this.currentWeight = weight[weight.length - 1][1];

        let sodium;
        sodium = this.currentPatient.logData.sodiumLog;
        this.currentSodium = sodium[sodium.length - 1][1];

        let fluid;
        fluid = this.currentPatient.logData.fluidLog;
        this.currentFluid = fluid[fluid.length - 1][1];

        let symptoms;
        symptoms = this.currentPatient.log;
        this.currentSymptoms = symptoms[symptoms.length - 1].symptomsEntry;
        
        GraphService.createChart('patient-graph', this.currentPatient.logData);

      };

      
    }
  });
