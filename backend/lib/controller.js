import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import { User, Log, SympLog } from './user.js';

const MONGO_CONNECTION = process.env.MONGODB_URI;

const formatLog = (log) => {
  let arr = [];
  arr = log.map(entry => {
    let entryArr = [];
    let d = new Date(entry.createdAt);
    entryArr.push(d.getTime());
    entryArr.push(entry.value);
    return entryArr;
  });
  return arr;
};

const formatUser = (user) => {
  user.weightLog = formatLog(user.weightLog);
  user.sodiumLog = formatLog(user.sodiumLog);
  user.fluidLog = formatLog(user.fluidLog);
  user.id = user._id;
  delete user._id;
  delete user.password;
  return user;
};

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
      User.findById(id).lean().then(
        u => {
          res.send(formatUser(u));
        },
        err => res.status(404).send(err)
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
      const SALT_FACTOR = 15;

      bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) res.status(422).json(err);
        bcrypt.hash(user.password, salt, null, function(error, hash) {
          user.password = hash;
        });
      });


      user.save().then(
        u => {
          req.logIn(user, function(error) {
            let isDoctor = false;
            if (error) res.send(422);
            if (user.license) isDoctor = true;
            res.send( { email: user.email, id: user._id, isDoctor} );
          });

        },
        e => res.status(422).send(e)
      );
    },
    err => {
      res.status(422).send(err);
    }
  );
};

export const updateUser = (req, res) => {
  mongoose.connect(MONGO_CONNECTION).then(
    () => {
      const { id } = req.params,
            { userInfo } = req.body,
            options = {
              new: true,
              upsert: false,
              runValidators: true
            };
      User.findById(id).then(
        user => {
          let updated = false;
          if (userInfo.stage && userInfo.stage !== user.stage) {
            user.stage = userInfo.stage;
            updated = true;
          }
          if (userInfo.weight) {
            let weightLogEntry = new Log({ value: userInfo.weight });
            user.weightLog.push(weightLogEntry);
            updated = true;
          }
          if (userInfo.sodium) {
            let sodiumLogEntry = new Log({   value: userInfo.sodium });
            user.sodiumLog.push(sodiumLogEntry);
            updated = true;
          }
          if (userInfo.fluid) {
            let fluidLogEntry = new Log({ value: userInfo.fluid });
            user.fluidLog.push(fluidLogEntry);
            updated = true;
          }
          if (userInfo.symptoms) {
            let sympLogEntry = new SympLog({ symptoms: userInfo.symptoms });
            user.symptomsLog.push(sympLogEntry);
            updated = true;
          }
          if (updated) {
            user.save().then(
              u => res.send(formatUser(u.toObject())),
              e => res.status(422).send(e)
            );
          }
        },
        error => res.status(404).send(error)
      );
    },
    err => {
      res.send(err);
    }
  );
};
