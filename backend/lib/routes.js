import * as controller from './controller.js';
import path from 'path';
import {login} from './session.js';
// import passport from 'passport';

// const isLoggedIn = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/');
// };

export const routerConfig = (app, passport) => {

  app.route('api/users')
    .get(controller.getAllUsers)
    .post(controller.createUser);

  app.route('/api/users/:id')
    .get(controller.fetchUser)
    // .put(controller.updateUser);

    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // res.redirect('/users/' + req.user.username);
  // });

  app.post('/api/sessions', function(req, res, next ){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.json( { message: info.message }); }
      res.json(user);
    })(req, res, next);
  });



  //login route
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname, '../../frontend/index.html'));
  // });
  //
  // //protected profile route. Try it in your browser when logged out.
  // app.get('/profile', isLoggedIn, (req, res) => {
  //   console.log(req.user);
  //   res.render(path.join(__dirname, '../frontend/profile.ejs'), {
  //     user: req.user
  //   });
  // });
  //
  // //logout route
  // app.get('/logout', (req, res) => {
  //   //flips the isAuthenticated property sent in the request of successRedirect to false
  //   req.logout();
  //   //eliminates token saved by express-session
  //   req.session.destroy();
  //
  //   res.redirect('/');
  // });
  //
  // //google request route
  // app.get('/auth/google',
  //   passport.authenticate('google', {
  //     scope : ['profile', 'email']
  //   })
  // );
  //
  // //google response route with appropriate redirects
  // app.get('/auth/google/callback',
  //   passport.authenticate('google', {
  //     successRedirect: '/profile',
  //     failureredirect: '/'
  //   })
  // );

};


