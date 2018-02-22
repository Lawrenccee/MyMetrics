angular.
  module('patientSignUp').
  component('patientSignUp', {
    templateUrl: 'session/patient-sign-up.template.html',
    controller: function ($http, UserService) {

      this.sendUser = () => {
        let button = document.getElementById("signup-button");
        button.setAttribute("disabled", "disabled");
        $http({
          method: "POST",
          url: '/api/users',
          data: { user: this.user }
        }).then(r => {
          console.log(r);
          UserService.setStore(this.user);
        },
          err => {
            button.setAttribute("enabled", "enabled")
          }
      );
      };
      }
    });
