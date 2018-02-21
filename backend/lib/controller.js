import mongoose from 'mongoose';
import { User, Log } from './user.js';

const MONGO_CONNECTION = process.env.MONGODB_URI;

export const getAllUsers = (req, res) => {
  mongoose.connect(MONGO_CONNECTION).then(
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
  mongoose.connect(MONGO_CONNECTION).then(
    () => {
      const { id } = req.params;
      User.findById(id).then(
        u => res.send(u),
        err => res.send(err)
      );
    },
    err => {
      console.log(err);
    }
  );
};

export const createUser = (req, res) => {
  mongoose.connect(MONGO_CONNECTION).then(
    () => {
      let user = new User(req.body.user);
      // User.findOne({ email: 'test0@test.com' }, (err, u) => {
      //   user.patients.push(u);
      //   user.save().then(r => res.send(r), err => res.send(err));
      // });
      user.save().then(
        u => res.send(u),
        e => res.send(e)
      );
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

export const updateUser = (req, res) => {
  mongoose.connect(MONGO_CONNECTION).then(
    () => {
      const { id } = req.params,
            { updateUser } = req.body,
            options = {
              new: true,
              upsert: false,
              runValidators: true
            };
      User.findById(id).then(
        user => {
          let updated = false;
          if (updateUser.weight) {
            let weightLogEntry = new Log({ value: updateUser.weight });
            user.weightLog.push(weightLogEntry);
            updated = true;
          }
          if (updateUser.sodium) {
            let sodiumLogEntry = new Log({ value: updateUser.sodium });
            user.sodiumLog.push(sodiumLogEntry);
            updated = true;
          }
          if (updateUser.fluid) {
            let fluidLogEntry = new Log({ value: updateUser.fluid });
            user.fluidLog.push(fluidLogEntry);
            updated = true;
          }
          if (updateUser.stage && updateUser.stage !== user.stage) {
            user.stage = updateUser.stage;
            updated = true;
          }
          if (updated) {
            user.save().then(
              u => res.send(u),
              e => res.send(e)
            );
          }
        },
        error => res.send(error)
      );
    },
    err => {
      res.send(err);
    }
  );
};
