angular.
  module('doctorView').
  component('doctorView', {
    templateUrl: 'doctor-view/doctor-view.template.html',
    controller: function ($routeParams, $http, UserService, $window) {
        // Controller will be updated, currently it is similar
        // to the patient view Wed 2/21
      this.$onInit = () => {
        // Get the patient stored by the login/signup set in the store
        // TODO: The store gets emptied if the page is refreshed...
        this.doctor = JSON.parse(UserService.getStore());

          // Do an http request to grab the patient were on???
          // But how do we know what patient it is...
        $http({
          method: 'GET',
          url: `/api/users/${this.doctor.id}`
        }).then((res) => {
          this.doctor = res.data;
          this.patients = this.doctor.patients;
          this.currentPatient = this.patients[0];
          console.log(this.doctor);
          console.log(this.currentPatient);
          this.createChart(this.currentPatient);

          let weight;
          weight = this.currentPatient.logData.weightLog;
          this.currentWeight = weight[weight.length-1][1];

          let sodium;
          sodium = this.currentPatient.logData.sodiumLog;
          this.currentSodium = sodium[sodium.length-1][1];

          let fluid;
          fluid = this.currentPatient.logData.fluidLog;
          this.currentFluid = fluid[fluid.length-1][1];

          console.log(this.currentSodium);
          console.log(this.currentWeight);
          console.log(this.currentFluid);
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

      this.createChart = (currentPatient) => {
        Highcharts.chart('patient-graph', {

          title: {
            text: ""
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
            data: currentPatient.logData.weightLog,
            tooltip: {
              valueDecimals: 2
            }
          }, {
            name: 'Sodium',
            data: currentPatient.logData.sodiumLog,
            tooltip: {
              valueDecimals: 2
            }
          }, {
            name: 'Fluid',
            data: currentPatient.logData.fluidLog,
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


      this.getPatient = (event) => {
        console.log(JSON.parse(event.target.dataset.patient));
        this.currentPatient = JSON.parse(event.target.dataset.patient);
        this.createChart(this.currentPatient);
      };

      
    }
  });
