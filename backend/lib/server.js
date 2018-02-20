import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import { passportConfig } from './passport.js';
import { routerConfig } from './routes.js';

require('dotenv').config();

//start the train
const app = express();

// //when we make requests with forms, we want to have the data sent in a body attribute
app.use(bodyParser.urlencoded({ extended: true }));

//session middleware necessary to save and persists a users login session
//the session key can be whatever you want, and the other two values are required defaults
//docs: https://github.com/expressjs/session
app.use(session({
  secret: 'PutAnythingYouWantHere',
  saveUninitialized: false,
  resave: false,
}));

//connects passport to key functions needed to communicate with the session and with Google,
//then connects passport to app
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

//connects app to all API endpoints definied in ./routes.js
routerConfig(app, passport);

//serves API endpoints at http://localhost:3000
app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
