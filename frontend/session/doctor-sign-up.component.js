angular.
  module('doctorSignUp').
  component('doctorSignUp', {
    templateUrl: 'session/doctor-sign-up.template.html',
    controller: function ($http, $window, UserService) {

      this.sendUser = () => {
        this.error = null;

        let button = document.getElementById("doc-signup-button");
        button.setAttribute("disabled", "disabled");
        $http({
          method: "POST",
          url: '/api/users',
          data: { user: this.user }
        }).then(r => {
          console.log(r);
          UserService.setStore(r.data);
          $window.location.href = '#!/doctorview';
        },
          err => {
            this.error = err.data.message; 
            button.removeAttribute("disabled");
          }
        );
      };
    }
  });
