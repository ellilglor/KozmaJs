const mongoose = require('mongoose');
const buyMuteSchema = new mongoose.Schema({
  _id: String,
  tag: String,
  expires: Date,
},{
  timestamps: true,
});

module.exports = mongoose.model('buy', buyMuteSchema, 'WTB-mutes');