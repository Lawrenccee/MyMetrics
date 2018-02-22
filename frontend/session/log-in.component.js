angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function(UserService, $http, $window) {

      this.sendUser = () => {
        // UserService.setStore(this.user);
        // console.log(this.user);
        $http({
          method: 'POST',
          url: '/api/sessions',
          data: this.user
        }).then(res => {
          UserService.setStore(res.data);
          if (res.data.isDoctor) {
            $window.location.href = '#!/doctorview';
          } else {
            $window.location.href = '#!/patientview';
          }
        });
      };
    }
  });

