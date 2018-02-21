import * as controller from './controller.js';
import path from 'path';

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

export const routerConfig = (app, passport) => {
  //use these to test that it's working
  app.get('/api/users', controller.getAllUsers);
  app.get('/api/users/:email', controller.fetchUser);
  app.post('/api/users', controller.createUser);

  //login route
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
  });

  //protected profile route. Try it in your browser when logged out.
  app.get('/profile', isLoggedIn, (req, res) => {
    console.log(req.user);
    res.render(path.join(__dirname, '../frontend/profile.ejs'), {
      user: req.user
    });
  });

  //logout route
  app.get('/logout', (req, res) => {
    //flips the isAuthenticated property sent in the request of successRedirect to false
    req.logout();
    //eliminates token saved by express-session
    req.session.destroy();

    res.redirect('/');
  });

  //google request route
  app.get('/auth/google',
    passport.authenticate('google', {
      scope : ['profile', 'email']
    })
  );

  //google response route with appropriate redirects
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureredirect: '/'
    })
  );
};
