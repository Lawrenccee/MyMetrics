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
        this.doctor = UserService.getStore();
        
        if(!this.doctor) {
          // Do an http request to grab the patient were on???
          // But how do we know what patient it is...
          $http({
            method: 'GET',
            url: '/api/users'
          }).then((users) => {
            this.doctor = users.data[0];
          });
        }

      };

      this.date = new Date();

      this.updatePatient = () => {
        console.log(this.patient);
      };

      this.logout = () => {
        UserService.clear();
        $http({
          method: 'DELETE',
          url: '/api/sessions'
        }).then((res) => {
          $window.location.href = '#!/login';
        });
        
      };

      // do something for check boxes to add to an array when they are checked
      // otherwise remove from patient array
    }
  });