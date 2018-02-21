import mongoose from 'mongoose';
import { User } from './user.js';


export const getAllUsers = (req, res) => {
  mongoose.connect(process.env.MONGODB_URI).then(
    () => {
      User.find((err, users) => {
        res.send(users);
      });
    },
    err => {
      console.log(err);
    }
  );
};

export const fetchUser = (req, res) => {
  mongoose.connect(process.env.MONGODB_URI).then(
    () => {
      const { email } = req.params;
      User.findOne({ email }, (err, users) => {
        res.send(users);
      });
    },
    err => {
      console.log(err);
    }
  );
};

export const createUser = (req, res) => {
  mongoose.connect(process.env.MONGODB_URI).then(
    () => {
      let user = new User(req.body.user);
      // User.findOne({ email: 'test0@test.com' }, (err, u) => {
      //   user.patients.push(u);
      //   user.save().then(r => res.send(r), err => res.send(err));
      // });
      user.save().then(u => res.send(u), e => res.send(e));
      // User.create(user, (err, u) => {
      //   if (err) res.send(err);
      //   if (u) res.send(u);
      // })
    },
    err => {
      res.send(err);
    }
  );
};
