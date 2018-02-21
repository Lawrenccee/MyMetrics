angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function(UserService) {

      this.sendUser = () => {
        UserService.store(this.user);
        console.log(this.user);
      };
    }
  });

