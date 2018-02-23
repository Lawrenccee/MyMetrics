angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function(UserService, $http, $window) {

      this.sendUser = () => {
        this.error = null;
        
        let button = document.getElementById("login-button");
        button.setAttribute("disabled", "disabled");
        $http({
          method: 'POST',
          url: '/api/sessions',
          data: this.user
        }).then(
          res => {
          UserService.setStore(res.data);
          if (res.data.isDoctor) {
            $window.location.href = '#!/doctorview';
          } else {
            $window.location.href = '#!/patientview';
          }
        },
          err => {
            this.error = err.data.message;
            button.removeAttribute("disabled");
          }
      );
      };
    }
  });

