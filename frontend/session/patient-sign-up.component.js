angular.
  module('patientSignUp').
  component('patientSignUp', {
    templateUrl: 'session/patient-sign-up.template.html',
    controller: function ($http, UserService, $window) {
      this.sendUser = () => {
        this.error = null;

        let button = document.getElementById("signup-button");
        button.setAttribute("disabled", "disabled");
        $http({
          method: "POST",
          url: '/api/users',
          data: { user: this.user }
        }).then(r => {
          UserService.setStore(r.data);
          $window.location.href = '#!/patientview';
        },
          err => {
            this.error = err.data.message; 
            button.removeAttribute("disabled");
          }
        );
      };
     }
   });
