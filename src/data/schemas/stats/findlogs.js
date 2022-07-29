const mongoose = require('mongoose');
const findlogSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  item: String,
  amount: { type: Number, default: 1 }
});

module.exports = mongoose.model('item', findlogSchema, 'findlogs');