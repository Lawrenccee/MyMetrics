angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function(UserService, $http, $window) {

      this.sendUser = () => {
        // UserService.setStore(this.user);
        // console.log(this.user);
        let button = document.getElementById("login-button");
        button.setAttribute("disabled", "disabled");
        $http({
          method: 'POST',
          url: '/api/sessions',
          data: this.user
        }).then(
          res => {
          console.log('response');
          console.log(res.data);
          UserService.setStore(res.data);
          $window.location.href = '#!/patientview';
        },
          err => {
            button.setAttribute("enabled", "enabled");
          }
      );
      };
    }
  });

