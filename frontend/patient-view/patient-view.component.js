
angular.
  module('patientView').
  component('patientView', {
    templateUrl: 'patient-view/patient-view.template.html',
    controller: function ($routeParams, $http, UserService, $window) {
      // do something to fetch the user's id/email from the route params
      // var Highcharts = require('highcharts');

      this.$onInit = () => {
        // Get the patient stored by the login/signup set in the store
        // TODO: The store gets emptied if the page is refreshed...
        this.patient = JSON.parse(UserService.getStore());
          // Do an http request to grab the patient were on???
          // But how do we know what patient it is...
        $http({
          method: 'GET',
          url: `/api/users/${this.patient.id}`
        }).then((res) => {
          this.patient = res.data;
          this.patient.symptoms = [];

          Highcharts.chart('graph', {

              title: {
                  text: "My Metrics"
              },

              yAxis: {
                  title: {
                      text: 'mg'
                  }
              },
              legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle'
              },

              xAxis: {
                type: 'datetime'
              },

              series: [{
                  name: 'Weight',
                  data: this.patient.weightLog,
                  tooltip: {
                    valueDecimals: 2
                  }
              }, {
                  name: 'Sodium',
                  data: this.patient.sodiumLog,
                  tooltip: {
                    valueDecimals: 2
                  }
              }, {
                  name: 'Fluid',
                  data: this.patient.fluidLog,
                  tooltip: {
                    valueDecimals: 2
                  }
              }],

              responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          legend: {
                              layout: 'horizontal',
                              align: 'center',
                              verticalAlign: 'bottom'
                          }
                      }
                  }]
              }
            });

        });
      };


      this.date = new Date();
      this.nextAppt = new Date();

      this.updatePatient = () => {
        return ($http({
          method: "PUT",
          url: `/api/users/${this.patient.id}`,
          data: { userInfo: this.patient }
        }).then(
          r => console.log(r),
          e => console.log(e)
        ));
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

      this.symptoms = [
        "Trouble breathing",
        "Chest pain",
        "Swelling in legs"
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
