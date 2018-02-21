//This controller file is not actually used in passport logic, but will be
//present in any practical application and is helpful for testing

// import pg from 'pg';
// import { connectionString } from './util.js';
import mongoose from 'mongoose';
import { userSchema } from './schema.js';


export const getAllUsers = (req, res) => {
  mongoose.connect(process.env.MONGODB_URI).then(
    () => {
      let User = mongoose.model("User", userSchema);
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
      let User = mongoose.model("User", userSchema);
      const { email } = req.params;
      User.findOne({ email }, (err, users) => {
        res.send(users)
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
      let User = mongoose.model("User", userSchema);
      User.create(req.body.user, (err) => {
        res.send(err);
      });
    },
    err => {
      res.send(err);
    }
  )
};
