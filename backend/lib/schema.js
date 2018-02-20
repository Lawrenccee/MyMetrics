import mongoose from 'mongoose';
let Schema = mongoose.Schema;

export const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    index: true
  },
  name: String,
});
