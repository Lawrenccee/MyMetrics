angular.
  module('patientSignUp').
  component('patientSignUp', {
    templateUrl: 'session/patient-sign-up.template.html',
    controller: function ($http, UserService, $window) {
      this.loading = false;

      this.sendUser = () => {
        this.loading = true;        
        this.error = null;

        if (this.user.password !== this.user.confirmPassword) {
          this.error = "Passwords do not match!";
          return;
        }

        let button = document.getElementById("signup-button");
        button.setAttribute("disabled", "disabled");
        $http({
          method: "POST",
          url: '/api/users',
          data: { user: this.user }
        }).then(r => {
          this.loading = false;
          UserService.setStore(r.data);
          $window.location.href = '#!/patientview';
        },
          err => {
            this.loading = false;
            this.error = err.data.message; 
            button.removeAttribute("disabled");
          }
        );
      };
     }
   });
