const mongoose = require('mongoose');

const FilesSchema = new mongoose.Schema({
  name: String,
  filename: String,
  file:
  {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('Files', FilesSchema);
