import mongoose from 'mongoose';
let Schema = mongoose.Schema;

export const logSchema = new Schema ({
  time: Number,
  value: String
});

export const userSchema = new Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(v);
      },
      message: 'Valid email address is required'
    },
    unique: true,
    index: true,
    required: [true, "Valid email address is required"]
  },
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  dob: {
    type: String,
    required: [true, "Date of birth is required"]
  },
  stage: Number,
  weightLog: [logSchema],
  sodiumLog: [logSchema],
  fluidLog: [logSchema],
  symptoms: [logSchema],
  medications: [String],
  doc_email: String,
  license: String,
  hospital: String,
  patients: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});
