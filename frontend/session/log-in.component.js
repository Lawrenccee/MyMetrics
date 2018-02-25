angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function(UserService, $http, $window) {
      this.loading = false;

      this.sendUser = () => {
        this.loading = true;        
        this.error = null;
        
        let button = document.getElementById("login-button");
        button.setAttribute("disabled", "disabled");
        $http({
          method: 'POST',
          url: '/api/sessions',
          data: this.user
        }).then(
          res => {
          this.loading = false;            
          UserService.setStore(res.data);
          if (res.data.isDoctor) {
            $window.location.href = '#!/doctorview';
          } else {
            $window.location.href = '#!/patientview';
          }
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

