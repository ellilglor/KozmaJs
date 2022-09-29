const mongoose = require('mongoose');

const punchSchema = new mongoose.Schema({
  _id: String,
  tag: String,
  single: { type: Number, default: 0 },
  double: { type: Number, default: 0 },
  triple: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
});

module.exports = mongoose.model('gambler', punchSchema, 'gamblers');