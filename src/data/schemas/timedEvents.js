const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  executed: { type: Number, default: 1 },
},{
  timestamps: true,
});

module.exports = mongoose.model('event', eventSchema, 'timedEvents');