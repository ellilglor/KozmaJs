const mongoose = require('mongoose');

const tradelogSchema = new mongoose.Schema({
  _id: String,
  channel: String,
  author: String,
  date: Date,
  messageUrl: String,
  content: String,
  image: String
});

module.exports = mongoose.model('tradelog', tradelogSchema, 'tradelogs');