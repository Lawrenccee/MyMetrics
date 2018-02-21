import {User} from './user.js';
import bCrypt from 'bcrypt-nodejs';



var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
};

export const login = (username, password, done) => {
  console.log('using local strat');
  User.findOne({ username: username }, function(err, user) {

    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!isValidPassword(user, password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
};