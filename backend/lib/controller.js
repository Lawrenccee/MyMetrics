import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './user.js';
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

      if (date.weightEntry) {
        weightEntryArr.push(date.entryDate);
        weightEntryArr.push(date.weightEntry);
        obj.weightLog.push(weightEntryArr);
      }
      if (date.sodiumEntry) {
        sodiumEntryArr.push(date.entryDate);
        sodiumEntryArr.push(date.sodiumEntry);
        obj.sodiumLog.push(sodiumEntryArr);
      }
      if (date.fluidEntry) {
        fluidEntryArr.push(date.entryDate);
        fluidEntryArr.push(date.fluidEntry);
        obj.fluidLog.push(fluidEntryArr);
      }
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
    dbConnectError => {
      res.status(503);
      res.send(dbConnectError);
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
        noUserError => {
          res.status(404);
          res.send(noUserError);
        }
      );
    },
    dbConnectError => {
      res.status(503);
      res.send(dbConnectError);
    }
  );
};

export const createUser = (req, res) => {
  mongoose.connect(MONGO_CONNECTION).then(
    () => {
      let user = new User(req.body.user);
      user.dates = {};
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
                  userSaveError => {
                    res.status(422);
                    res.send(userSaveError);
                  }
                );
              },
              noUserError => {
                res.status(404);
                res.send(noUserError);
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
              userSaveError => {
                res.status(422);
                res.send({message: "Email has already been taken"});
              }
            );
          }
        });
      });
    },
    dbConnectError => {
      res.status(503);
      res.send(dbConnectError);

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
          let userUpdated = false,
            logUpdated = false,
            logEntry = null,
            logId = user.dates[`${userInfo.entryDate}`];

          if (userInfo.nextAppt !== user.nextAppt) {
            user.nextAppt = userInfo.nextAppt;
            userUpdated = true;
          }
          if (userInfo.stage && userInfo.stage !== user.stage) {
            user.stage = userInfo.stage;
            userUpdated = true;
          }
          if (userInfo.medications) {
            if (user.medications.length != userInfo.medications.length || !compareArray(user.medications, userInfo.medications)){
              user.medications = userInfo.medications;
              userUpdated = true;
            }
          }
          if (logId) {
            LogEntry.findById(logId).then(
              log => {
                logUpdated = updateLog(log, userInfo.weight, userInfo.sodium, userInfo.fluid, userInfo.symptoms);
                if (logUpdated) {
                  log.save().then(
                    l => {
                      user.save().then(
                        u => {
                          u.populate('log', (popError, populatedUser) => {
                            if (popError) res.send(popError);
                            if (populatedUser) res.send(formatUser(populatedUser.toObject()));
                          })
                        },
                        userSaveError => {
                          res.status(422);
                          res.send(userSaveError);
                        }
                      );
                    },
                    logSaveError => {
                      res.status(422);
                      res.send(logSaveError);
                    }
                  );
                } else if (userUpdated) {
                  user.save().then(
                    u => {
                      console.log("user saved");
                      u.populate('log', (popError, populatedUser) => {
                        if (popError) res.send(popError);
                        if (populatedUser) res.send(formatUser(populatedUser.toObject()));
                      })
                    }
                  )
                }
              }
            );
          } else {
            logEntry = new LogEntry({ entryDate: userInfo.entryDate });
            logUpdated = updateLog(logEntry, userInfo.weight, userInfo.sodium, userInfo.fluid, userInfo.symptoms);
            if (userUpdated || logUpdated) {
              if (logUpdated) {
                logEntry.save().then(
                  l => {
                    user.log.push(logEntry);
                    user.populate('log', (err, populatedUser) => {
                      populatedUser.log.sort(function (x, y) {
                        return x.entryDate - y.entryDate;
                      });
                      user.log = populatedUser.log;
                      user.dates[`${logEntry.entryDate}`] = logEntry._id;
                      user.markModified('dates');
                      user.save().then(
                        u => {
                          u.populate('log', (popError, newPopulatedUser) => {
                            if (popError) res.send(popError);
                            if (newPopulatedUser) res.send(formatUser(newPopulatedUser.toObject()));
                          });
                        },
                        e => res.status(422).send(e)
                      );
                    });

                  },
                  logSaveError => {
                    res.status(422);
                    res.send(logSaveError);
                  }
                );
              } else {
                user.save().then(
                  u => {
                    u.populate('log', (popError, populatedUser) => {
                      if (popError) res.send(popError);
                      if (populatedUser) res.send(formatUser(populatedUser.toObject()));
                    });
                  },
                  userSaveError => res.status(422).send(userSaveError)
                );
              }
            } else {
              console.log("no update");
            }
          }
        },
        noUserError => res.status(404).send(noUserError)
      );
    },
    dbConnectError => {
      res.status(503);
      res.send(dbConnectError);
    }
  );
};

const updateLog = (logEntry, weight, sodium, fluid, symptoms) => {
  let updated = false;
  if (weight && logEntry.weightEntry != weight) {
    logEntry.weightEntry = weight;
    updated = true;
  }
  if (sodium && logEntry.sodiumEntry != sodium) {
    logEntry.sodiumEntry = sodium;
    updated = true;
  }
  if (fluid && logEntry.fluidEntry != fluid) {
    logEntry.fluidEntry = fluid;
    updated = true;
  }
  if (symptoms && (symptoms.length !== logEntry.symptomsEntry.length || !compareArray(logEntry.symptomsEntry, symptoms))) {
    logEntry.symptomsEntry = symptoms;
    updated = true;
  }
  return updated;
};

const compareArray = (arr1, arr2) => {
  arr1.sort();
  arr2.sort();

  return (arr1.every(function (el, idx) { return el === arr2[idx]; }));
};
