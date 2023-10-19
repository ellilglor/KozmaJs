const mongoose = require('mongoose');

const sellMuteSchema = new mongoose.Schema({
  _id: String,
  tag: String,
  expires: Date,
},{
  timestamps: true,
});

module.exports = mongoose.model('sell', sellMuteSchema, 'WTS-mutes');