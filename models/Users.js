const mongoose = require('mongoose');

const { Schema } = mongoose;

const UsersSchema = new mongoose.Schema({
  id: String,
  firstname: String,
  lastname: String,
  role: String,
  username: { type: String, unique: true },
  password: String,
  accountLocked: Boolean,
  logins: [],
  studies: [],
  configurations: Schema.Types.Mixed
});

module.exports = mongoose.model('Users', UsersSchema);
