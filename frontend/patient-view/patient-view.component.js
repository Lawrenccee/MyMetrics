angular.
  module('patientView').
  component('patientView', {
    templateUrl: 'patient-view/patient-view.template.html',
    controller: function ($routeParams, $http, UserService, GraphService, $window) {
      this.warnings = [];
      this.date = new Date();

      this.$onInit = () => {
        this.patient = JSON.parse(UserService.getStore());

        $http({
          method: 'GET',
          url: `/api/users/${this.patient.id}`
        }).then((res) => {
          this.patient = res.data;
          if (new Date() < this.patient.nextAppt) {
            this.nextAppt = new Date(this.patient.nextAppt);
          }
          this.patient.symptoms = [];

          GraphService.createChart('graph', this.patient.logData);

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
            GraphService.createChart('graph', r.data.logData);
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
            if (!todayWeight) {
              todayWeight = obj.weightEntry;
            }
            if (!todayFluid) {
              todayFluid = obj.fluidEntry;
            }
            if (!todaySodium) {
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
          this.warnings.push("Your fluids >= 2000ml for the day");
        }

        if (todaySodium && todaySodium >= 2000) {
          this.warnings.push("Your sodium intake >= 2000mg for the day");
        }

        if (this.warnings.length > 0) {
          return true;
        } 

        return false;
      };
    }
  });
