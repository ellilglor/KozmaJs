const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,
  tag: String,
  amount: { type: Number, default: 0 },
  unboxed: { type: Number, default: 0 },
  punched: { type: Number, default: 0 }
});

module.exports = mongoose.model('user', userSchema, 'users');