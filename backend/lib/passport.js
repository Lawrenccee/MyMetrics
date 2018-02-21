import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import mongoose from 'mongoose';
import { User } from './user.js';
import passport from 'passport';
import LocalStrategy from 'passport-local';

require('dotenv').config();

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// const googleConfig = {
//   clientID: process.env.G_CLIENT_ID,
//   clientSecret: process.env.G_CLIENT_SECRET,
//   callbackUrl: process.env.G_CALLBACK_URL
// };
//
// export const passportConfig = (passport) => {
//   // used to serialize the user for the session
//   passport.serializeUser((user, done) => done(null, user.id));
//   // used to deserialize the user
//   passport.deserializeUser((id, done) => findUserById(id, done));
//
//   passport.use(new GoogleStrategy(googleConfig,
//     (token, refreshToken, profile, done) => {
//       process.nextTick(() => findOrCreateUser(token, profile, done));
//     }));
// };
//
// //helper functions for passportConfig
//
// const findUserById = (id, done) => {
//   // const client = new pg.Client(connectionString);
//   // client.connect(err => {
//   //   client.query(`SELECT * FROM users WHERE id=\'${id}\'`)
//   //   .then(
//   //     data => {
//   //       const user = data.rows[0];
//   //       done(null, user);
//   //     },
//   //     err => done(err, null)
//   //   )
//   //   .then(() => client.end());
//   // });
// };
//
// const findOrCreateUser = (token, profile, done) => {
//   // const client = new pg.Client(connectionString);
//   // client.connect(err => {
//   //   client.query(`SELECT * FROM users WHERE googleId=\'${profile.id}\'`)
//   //   .then(
//   //     foundUsers => {
//   //       let user = foundUsers.rows[0];
//   //       if (user) {
//   //         done(null, user);
//   //       } else {
//   //         client.query(`INSERT INTO users (name, email, avatar, googleId, token) VALUES (\'${profile.name.givenName}\', \'${profile.emails[0].value}\', \'${photoUrlHelper(profile.photos[0].value)}\', \'${profile.id}\', \'${token}\') RETURNING *`)
//   //         .then(
//   //           createdUsers => done(null, createdUsers.rows[0]),
//   //           err => done(err, null)
//   //         );
//   //       }
//   //     }
//   //   )
//   //   .then(() => client.end());
//   // });
// };
//
// //Google Profile Img url comes with query string tagged on to make image size tiny, so this cuts it off
// const photoUrlHelper = (url) => {
//   return url.substr(0, url.indexOf('?'));
// };