import { mongoDBKey } from '../config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { routerConfig } from './routes.js';

const app = express();

mongoose.connect(mongoDBKey);
const db = mongoose.connection;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('lib'));

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
});

app.post('/signup', (req, res) => {
  console.log(req.body);
  db.collection('signup').save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to db');
    res.redirect('/');
  });
});


routerConfig(app);

app.listen(3000);
console.log('running on port 3000');
