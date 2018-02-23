import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, SympLog } from './user.js';
import { LogEntry } from './log_entry.js'

const MONGO_CONNECTION = process.env.MONGODB_URI;

const formatLog = (log) => {
  let obj = {
    weightLog: [],
    sodiumLog: [],
    fluidLog: []
  };
  log.map(date => {
    let weightEntryArr = [],
      sodiumEntryArr = [],
      fluidEntryArr = [];
    let dateInt = parseInt(date.entryDate);
    weightEntryArr.push(dateInt);
    weightEntryArr.push(date.weightEntry);
    sodiumEntryArr.push(dateInt);
    sodiumEntryArr.push(date.sodiumEntry);
    fluidEntryArr.push(dateInt);
    fluidEntryArr.push(date.fluidEntry);
    obj.weightLog.push(weightEntryArr);
    obj.sodiumLog.push(sodiumEntryArr);
    obj.fluidLog.push(fluidEntryArr);
  });

  return obj;
};

const formatUser = (user) => {
  user.logData = formatLog(user.log);
  user.id = user._id;
  delete user._id;
  delete user.password;
  return user;
};

export const getAllUsers = (req, res) => {
  mongoose.connect(MONGO_CONNECTION).then(
    () => {
      User.find((err, users) => {
        if (err) {
          res.status(404);
          res.send(err);
        }
        if (users) res.send(users);
      });
    },
    error => {
      res.status(503);
      res.send(error);
    }
  );
};

export const fetchUser = (req, res) => {
  mongoose.connect(MONGO_CONNECTION).then(
    () => {
      const { id } = req.params;
      User.findById(id).populate('patients', '-password').populate('log').lean().then(
        u => {
          res.send(formatUser(u));
        },
        e => {
          res.status(404);
          res.send(e);
        }
      );
    },
    error => {
      res.status(503);
      res.send(error);
    }
  );
};

export const createUser = (req, res) => {
  mongoose.connect(MONGO_CONNECTION).then(
    () => {
      let user = new User(req.body.user);

      const SALT_FAC = process.env.SALT_FACTOR;

      bcrypt.genSalt(parseInt(SALT_FAC), function(err, salt) {
        bcrypt.hash(user.password, salt, function(error, hash) {
          user.password = hash;

          if (user.doc_email) {
            User.findOne({ email: user.doc_email }).then(
              doc => {
                user.save().then(
                  u => {
                    doc.patients.push(u);
                    doc.save();
                    req.logIn(user, function(error) {
                      let isDoctor = false;
                      if (error) res.send(422);
                      if (user.license) isDoctor = true;
                      res.send( { email: user.email, id: user._id, isDoctor } );
                    });
                  },
                  e => {
                    res.status(422);
                    res.send(e);
                  }
                );
              },
              err => {
                res.status(404);
                res.send(err);
              }
            );
          } else {
            user.save().then(
              u => {
                req.logIn(user, function(error) {
                  let isDoctor = false;
                  if (user.license) isDoctor = true;
                  res.send( { email: user.email, id: user._id, isDoctor} );
                });
              },
              e => {
                res.status(422);
                res.send({message: "Email has already been taken"});
              }
            );
          }
        });
      });
    },
    error => {
      res.status(503);
      res.send(error);

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
          let logEntry = new LogEntry({ entryDate: userInfo.entryDate });
          if (userInfo.weight) {
            logEntry.weightEntry = userInfo.weight;
            updated = true;
          }
          if (userInfo.sodium) {
            logEntry.sodiumEntry = userInfo.sodium;
            updated = true;
          }
          if (userInfo.fluid) {
            logEntry.fluidEntry = userInfo.fluid;
            updated = true;
          }

          if (userInfo.symptoms.length > 0) {
            let sympLogEntry = new SympLog({ symptoms: userInfo.symptoms });
            user.symptomsLog.push(sympLogEntry);
            updated = true;
          }
          if (userInfo.medications) {
            if (user.medications.length != userInfo.medications.length || !(user.medications.every(function(med, idx) { return med === userInfo.medications[idx] }))){
              user.medications = userInfo.medications;
              updated = true;
            }
          }
          if (updated) {
            console.log("did update");
            logEntry.save();
            user.log.push(logEntry);
            user.save().then(
              u => {console.log(u.populate('log')); res.send(formatUser(u.populate('log').toObject()));},
              e => res.status(422).send(e)
            );
          } else {
            console.log("no update");
          }
        },
        error => res.status(404).send(error)
      );
    },
    error => {
      res.status(503);
      res.send(error);
    }
  );
};
