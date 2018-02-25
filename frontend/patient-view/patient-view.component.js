
angular.
  module('patientView').
  component('patientView', {
    templateUrl: 'patient-view/patient-view.template.html',
    controller: function ($routeParams, $http, UserService, $window) {
      this.warnings = [];
      this.date = new Date();

      this.$onInit = () => {
        this.patient = JSON.parse(UserService.getStore());

        $http({
          method: 'GET',
          url: `/api/users/${this.patient.id}`
        }).then((res) => {
          console.log(res.data);
          this.patient = res.data;
          if (new Date() < this.patient.nextAppt) {
            this.nextAppt = new Date(this.patient.nextAppt);
          }
          this.patient.symptoms = [];

          createChart(this.patient.logData);

          let today = new Date(
            new Date().setHours(0, 0, 0, 0)).
            setFullYear(
              this.date.getFullYear(),
              this.date.getMonth(),
              this.date.getDate()
            );

          checkVitals({});

          this.patient.log.forEach((obj, index) => {
            if (parseInt(obj.entryDate) === today) {
              this.patient.weight = obj.weightEntry;
              this.patient.sodium = obj.sodiumEntry;
              this.patient.fluid = obj.fluidEntry;
              this.patient.symptoms = obj.symptomsEntry;
            }
          });
        });
      };

      this.updatePatient = () => {   
        this.patient.entryDate = new Date(
          new Date().setHours(0, 0, 0, 0)).
          setFullYear(
            this.date.getFullYear(),
            this.date.getMonth(),
            this.date.getDate()
          );

        this.warnings = [];     
        setInDanger();

        return ($http({
          method: "PUT",
          url: `/api/users/${this.patient.id}`,
          data: { userInfo: this.patient }
        }).then(
          r => {
            let inputDate = new Date(
              new Date().setHours(0, 0, 0, 0)).
              setFullYear(
                this.date.getFullYear(),
                this.date.getMonth(),
                this.date.getDate()
              );

            r.data.log.forEach((obj, index) => {
              if (parseInt(obj.entryDate) === inputDate) {
                this.patient.symptoms = obj.symptomsEntry;
              }
            });

            this.patient.log = r.data.log;

            checkVitals({});
            createChart(r.data.logData);
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

      this.changeDate = () => {
        let dateMs = new Date(
          new Date().setHours(0, 0, 0, 0)).
          setFullYear(
            this.date.getFullYear(),
            this.date.getMonth(),
            this.date.getDate()
          );

        this.patient.weight = undefined;
        this.patient.sodium = undefined;
        this.patient.fluid = undefined;
        this.patient.symptoms = [];

        this.patient.log.forEach((obj, index) => {
          if (parseInt(obj.entryDate) === dateMs) {
            this.patient.weight = obj.weightEntry;
            this.patient.sodium = obj.sodiumEntry;
            this.patient.fluid = obj.fluidEntry;
            this.patient.symptoms = obj.symptomsEntry;
          }
        });
      };

      this.changeNextAppt = () => {
        this.patient.nextAppt = Date.parse(this.nextAppt);
      };

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

      const setInDanger = () => {
        let today = new Date().setHours(0, 0, 0, 0);

        let yday = new Date();
        yday.setDate(yday.getDate() - 1);
        yday = yday.setHours(0, 0, 0, 0);

        let weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo = weekAgo.setHours(0, 0, 0, 0);

        if (this.patient.entryDate === today) {
          this.patient.inDanger = checkVitals({
            todayFluid: this.patient.fluid,
            todaySodium: this.patient.sodium,
            todayWeight: this.patient.weight
          });
        }

        if (this.patient.entryDate === yday) {
          this.patient.inDanger = checkVitals({
            ydayWeight: this.patient.weight
          });
        }

        if (this.patient.entryDate === weekAgo) {
          this.patient.inDanger = checkVitals({
            weekAgoWeight: this.patient.weight
          });
        }
      };

      const checkVitals = ({todayWeight, todayFluid, todaySodium, ydayWeight, weekAgoWeight}) => {
        this.warnings = [];

        let today = new Date().setHours(0, 0, 0, 0);

        let yday = new Date();
        yday.setDate(yday.getDate() - 1);
        yday = yday.setHours(0, 0, 0, 0);

        let weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo = weekAgo.setHours(0, 0, 0, 0);

        this.patient.log.forEach((obj, index) => {
          if (parseInt(obj.entryDate) === today) {
            if (!(todayWeight && todayFluid && todaySodium)) {
              todayWeight = obj.weightEntry;
              todayFluid = obj.fluidEntry;
              todaySodium = obj.sodiumEntry;
            }
          }
          if (parseInt(obj.entryDate) === yday) {
            if (!ydayWeight) {
             ydayWeight = obj.weightEntry;
            }
          }
          if (parseInt(obj.entryDate) === weekAgo) {
            if (!weekAgoWeight) {
            weekAgoWeight = obj.weightEntry;
            }
          }
        });

        if (ydayWeight && todayWeight && todayWeight - ydayWeight >= 2) {
          this.warnings.push("You have gained 2 or more pounds since yesterday");
        }

        if (weekAgoWeight && todayWeight && todayWeight - weekAgoWeight >= 5) {
          this.warnings.push("You have gained 5 or more pounds in a week");
        }

        if (todayFluid && todayFluid >= 2000) {
          this.warnings.push("Your fluids are over 2 liters for the day");
        }

        if (todaySodium && todaySodium >= 2000) {
          this.warnings.push("Your sodium is over 2 grams for the day");
        }

        if (this.warnings.length > 0) {
          return true;
        } 

        return false;
      };

      const createChart = ({ weightLog, sodiumLog, fluidLog }) => {
        this.chart = Highcharts.chart('graph', {

          title: {
            text: "My Metrics"
          },
          yAxis: {
            title: {
              text: 'lbs/mg/ml'
            },
            plotLines: [{
              value: 2000,
              color: 'red',
              dashStyle: 'shortdash',
              width: 2,
              label: {
                text: 'Sodium and Fluid Thresholds'
              }
            }]
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },
          tooltip: {
            xDateFormat: '%Y %b %e',
          },
          xAxis: {
            type: 'datetime',
            labels: {
              format: '{value:%Y-%b-%e}'
            }
          },

          series: [{
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
          }, {
            name: 'Weight',
            data: weightLog,
            tooltip: {
              valueDecimals: 2
            },
          }],

          responsive: {
            rules: [{
              condition: {
                minWidth: 0,
              },
              chartOptions: {
                legend: {
                  verticalAlign: 'top',
                  layout: 'horizontal',
                  align: 'center',
                  itemStyle: {
                    fontSize: "20px",
                  },
                }
              }
            }]
          }
        });
      };
    }
  });
