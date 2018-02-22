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
}

const formatUser = (user) => {
  user.weightLog = formatLog(user.weightLog);
  user.sodiumLog = formatLog(user.sodiumLog);
  user.fluidLog = formatLog(user.fluidLog);
  user.id = user._id;
  delete user._id;
  delete user.password;
  return user;
}

export const getAllUsers = (req, res) => {
  mongoose.connect(MONGO_CONNECTION).then(
    () => {
      User.find((err, users) => {
        if (err) res.send(err)
        if (users) res.send(users);
      });
    },
    error => {
      res.send(error);
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
        e => res.send(e)
      );
    },
    error => {
      res.send(error);
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

      const SALT_FAC = process.env.SALT_FACTOR;

      bcrypt.genSalt(SALT_FAC, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
        });
      });
      user.save().then(
        u => {
          if (u.doc_email) {
            User.findOne({ email: u.doc_email }).then(
              doc => {
                doc.patients.push(u)
                doc.save();
              },
              err => res.send(err)
            )
          }
          res.send(formatUser(u.toObject()))
        },
        e => res.send(e)
      );
      // User.create(user, (err, u) => {
      //   if (err) res.send(err);
      //   if (u) res.send(u);
      // })
    },
    error => {
      res.send(error);
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
          if (updateUser.stage && updateUser.stage !== user.stage) {
            user.stage = updateUser.stage;
            updated = true;
          }
          if (updateUser.weight) {
            let weightLogEntry = new Log({ value: updateUser.weight });
            user.weightLog.push(weightLogEntry);
            updated = true;
          }
          if (updateUser.sodium) {
            let sodiumLogEntry = new Log({   value: updateUser.sodium });
            user.sodiumLog.push(sodiumLogEntry);
            updated = true;
          }
          if (updateUser.fluid) {
            let fluidLogEntry = new Log({ value: updateUser.fluid });
            user.fluidLog.push(fluidLogEntry);
            updated = true;
          }
          if (updateUser.symptoms) {
            let sympLogEntry = new SympLog({ symptoms: updateUser.symptoms });
            user.symptomsLog.push(sympLogEntry);
            updated = true;
          }
          if (updated) {
            user.save().then(
              u => res.send(formatUser(u.toObject())),
              e => res.send(e)
            );
          }
        },
        err => res.send(err)
      );
    },
    error => {
      res.send(error);
    }
  );
};
