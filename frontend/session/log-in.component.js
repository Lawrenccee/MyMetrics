angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function(UserService, $http) {

      this.sendUser = () => {
        // UserService.setStore(this.user);
        // console.log(this.user);
        $http({
          method: 'POST',
          url: '/api/sessions',
          data: this.user
        }).then(res => {
          console.log('response');
          console.log(res.data);
          UserService.setStore(res.data);
        });
      };
    }
  });

