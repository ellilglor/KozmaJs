const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  command: String,
  amount: { type: Number, default: 1 }
});

module.exports = mongoose.model('command', commandSchema, 'commands');