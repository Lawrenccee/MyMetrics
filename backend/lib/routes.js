import * as controller from './controller.js';
import path from 'path';

// import passport from 'passport';

const isLoggedIn = (req, res, next) => {
  console.log(req);
  if (req.user) {
    return next();
  } else {
    return res.status(401).json( { error: 'User not logged in' } );
  }
};

export const routerConfig = (app, passport) => {

  app.route('/api/users')
    .get(controller.getAllUsers)
    .post(controller.createUser);

  app.route('/api/users/:id')
    .get(controller.fetchUser);
    .put(controller.updateUser);

    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // res.redirect('/users/' + req.user.username);
  // });

  app.post('/api/sessions', function(req, res, next ){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.json( { message: info.message }); }
      req.logIn(user, function(error) {
        console.log(req.session);
        if (error) { return next(error); }
        res.send( { email: user.email, id: user._id } );
      });
    })(req, res, next);
  });

  app.delete('/api/sessions', function(req, res, next){
    console.log(req.session);
    req.logout();

    res.json({message: 'logged out'});
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
