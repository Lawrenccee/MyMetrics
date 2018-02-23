import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LogSchema = new Schema ({
  weightEntry: Number,
  sodiumEntry: Number,
  fluidEntry: Number,
  entryDate: String
});

export const LogEntry = mongoose.model('LogEntry', LogSchema);
