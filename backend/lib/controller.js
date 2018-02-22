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
      const { id } = req.params;
      console.log(req.params);
      console.log(id);
      User.findById(id, (err, user) => {
        res.send(user);
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
      User.create(req.body.user, (err, user) => {
        if (err) res.send(err);
        res.send(user);
      });
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




