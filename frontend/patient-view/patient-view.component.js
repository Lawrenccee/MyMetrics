
angular.
  module('patientView').
  component('patientView', {
    templateUrl: 'patient-view/patient-view.template.html',
    controller: function ($routeParams, $http, UserService, $window) {

      this.$onInit = () => {
        this.patient = JSON.parse(UserService.getStore());
          
        $http({
          method: 'GET',
          url: `/api/users/${this.patient.id}`
        }).then((res) => {
          this.patient = res.data;
          this.patient.symptoms = [];

          createChart(this.patient);

          console.log(res.data.weightLog[0][0]);
          console.log(new Date(
            new Date().
            setHours(0, 0, 0, 0)).
            setFullYear(this.date.getFullYear(), 
            this.date.getMonth(), 
            this.date.getDate()
          ));

          let today = new Date(
            new Date().setHours(0, 0, 0, 0)).
            setFullYear(
              this.date.getFullYear(),
              this.date.getMonth(),
              this.date.getDate()
            );

          this.patient.weightLog.forEach((values, index) => {
            if (new Date(values[0]) === today) {
              this.weight = values[1];
            }
          });

          this.patient.sodiumLog.forEach((values, index) => {
            if (new Date(values[0]) === today) {
              this.sodium = values[1];
            }
          });

          this.patient.fluidLog.forEach((values, index) => {
            if (new Date(values[0]) === today) {
              this.fluid = values[1];
            }
          });
        });
      };

      this.date = new Date();
      this.nextAppt = new Date();

      this.updatePatient = () => {
        this.patient.date = new Date(
          new Date().setHours(0, 0, 0, 0)).
          setFullYear(
            this.date.getFullYear(),
            this.date.getMonth(),
            this.date.getDate()
          );

        return ($http({
          method: "PUT",
          url: `/api/users/${this.patient.id}`,
          data: { userInfo: this.patient }
        }).then(
          r => {
            createChart(r.data);
          },
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

      const createChart = ({ weightLog, sodiumLog, fluidLog }) => {
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
            data: weightLog,
            tooltip: {
              valueDecimals: 2
            }
          }, {
            name: 'Sodium',
            data: sodiumLog,
            tooltip: {
              valueDecimals: 2
            }
          }, {
            name: 'Fluid',
            data: fluidLog,
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
      };
    }
  });
