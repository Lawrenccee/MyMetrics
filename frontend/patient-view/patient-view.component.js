angular.
  module('patientView').
  component('patientView', {
    templateUrl: 'patient-view/patient-view.template.html',
    bindings: {
      patient: '<'
    },
    controller: function ($routeParams, $http, UserService) {
      // do something to fetch the user's id/email from the route params

      this.$onInit = () => {
        // Get the patient stored by the login/signup set in the store
        // TODO: The store gets emptied if the page is refreshed...
        this.patient = UserService.getStore();
        console.log(this.patient);

        if(!this.patient) {
          // Do an http request to grab the patient were on???
          // But how do we know what patient it is...
          $http({
            method: 'GET',
            url: '/api/users'
          }).then((users) => {
            this.patient = users.data[0];
          });
        }
      };

      console.log("this gets called");
      // set user to that user so we can show it in the html
      // for now it will be a fake user
      this.patient = {
        name: "Sam Uchiha",
        id: "5a8dbb57906a13ff606c49cc"
      };

      this.date = new Date();

      this.updatePatient = () => {
        console.log(this.patient);
        return ($http({
          method: "GET",
          url: `/api/users/${this.patient.id}`,
          // data: { updateUser: this.patient }
        }).then(
          r => console.log(r),
          e => console.log(e)
        ));
      };

      this.logout = () => {
        UserService.clear();
      };

      // do something for check boxes to add to an array when they are checked
      // otherwise remove from patient array
    }
  });
