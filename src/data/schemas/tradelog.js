const mongoose = require('mongoose');
const tradelogSchema = new mongoose.Schema({
  _id: String,
  channel: String,
  date: String,
  messageUrl: String,
  content: String,
  image: { type: String, default: null}
});

module.exports = mongoose.model('tradelog', tradelogSchema, 'tradelogs');