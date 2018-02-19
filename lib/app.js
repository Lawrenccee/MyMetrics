import {mongoDBKey} from '../config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();

mongoose.connect(mongoDBKey);
const db = mongoose.connection;

app.get('/', function(req, res) {
  res.send('hello there');
});

app.listen(3000);
console.log('running on port 3000');