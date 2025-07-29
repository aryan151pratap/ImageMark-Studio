const mongoose = require('mongoose');

const labelDataSchema = new mongoose.Schema({
  label: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number
}, { _id: false });

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
  },
  img_height: {
    type: String,
  },
  img_width: {
    type:String,
  },
  labels: [labelDataSchema]
}, { _id: false });

const folderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  folder: {
    type: String,
    required: true
  },
  files: [fileSchema]
});

module.exports = mongoose.model('Label', folderSchema);
