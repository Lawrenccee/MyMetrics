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
          console.log(this.patients);
          console.log(this.currentPatient);

          Highcharts.chart('graph', {

            title: {
              text: `${this.currentPatient.name}`
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
              data: this.currentPatient.weightLog,
              tooltip: {
                valueDecimals: 2
              }
            }, {
              name: 'Sodium',
              data: this.currentPatient.sodiumLog,
              tooltip: {
                valueDecimals: 2
              }
            }, {
              name: 'Fluid',
              data: this.currentPatient.fluidLog,
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
        console.log(JSON.parse(event.target.dataset.patient));
        this.currentPatient = JSON.parse(event.target.dataset.patient);
      };
    }
  });
