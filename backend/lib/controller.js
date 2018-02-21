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
      User.create(req.body.user, (err) => {
        res.send(err);
      });
    },
    err => {
      res.send(err);
    }
  );
};


