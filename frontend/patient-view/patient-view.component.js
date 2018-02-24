
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
          if (new Date() < this.patient.nextAppt) {
            // MIGHT HAVE TO CONVERT FROM MILLISECONDS TO DATE
            this.nextAppt = this.patient.nextAppt;
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

          checkVitals();

          this.patient.log.forEach((obj, index) => {
            if (parseInt(obj.entryDate) === today) {
              this.patient.weight = obj.weightEntry;
              this.patient.sodium = obj.sodiumEntry;
              this.patient.fluid = obj.fluidEntry;
              this.patient.symptoms = obj.symptomsEntry;
              console.log(obj);
            }
          });
        });
      };

      this.warnings = [];
      this.date = new Date();
      this.nextAppt = undefined;

      this.updatePatient = () => {
        this.patient.entryDate = new Date(
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
            console.log(r);
            this.warnings = [];
            let today = new Date(
              new Date().setHours(0, 0, 0, 0)).
              setFullYear(
                this.date.getFullYear(),
                this.date.getMonth(),
                this.date.getDate()
              );
            this.patient.log.forEach((obj, index) => {
              if (parseInt(obj.entryDate) === today) {
                this.patient.symptoms = obj.symptomsEntry;
                console.log(obj);
              }
            });
            this.patient.log = r.data.log;
            checkVitals();
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
        this.patient.nextAppt = this.nextAppt;
      };

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

      const checkVitals = () => {
        // CALL THIS METHOD WHEN UPDATING PATIENT, CALL WHEN INIT
        let today = new Date().setHours(0, 0, 0, 0);

        let yday = new Date();
        yday.setDate(yday.getDate() - 1);
        yday = yday.setHours(0, 0, 0, 0);

        let weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo = weekAgo.setHours(0, 0, 0, 0);

        let ydayWeight = null;
        let weekAgoWeight = null;
        let todayWeight = null;
        let todayFluid = null;
        let todaySodium = null;

        this.patient.log.forEach((obj, index) => {
          if (parseInt(obj.entryDate) === today) {
            todayWeight = obj.weightEntry;
            todayFluid = obj.fluidEntry;
            todaySodium = obj.sodiumEntry;
          }
          if (parseInt(obj.entryDate) === yday) {
             ydayWeight = obj.weightEntry;
          }
          if (parseInt(obj.entryDate) === weekAgo) {
            weekAgoWeight = obj.weightEntry;
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
            // visible: false
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
        // this.chart.series[0].hide();
        this.chart.series.forEach(chart => console.log(chart.visible));        
      };
    }
  });
