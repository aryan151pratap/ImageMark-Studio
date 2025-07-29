const mongoose = require("mongoose");

const labelDataSchema = new mongoose.Schema({
  label: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  filename: {
    type: String
  },
  contentType:{
    type: String
  },
  folder: {
    type: String,
    default: ''
  },
  labels: {
    type: [labelDataSchema],
    default: []
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
