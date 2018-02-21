angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function() {

      this.sendUser = () => {
        console.log(this.user);
      };
    }
  });

