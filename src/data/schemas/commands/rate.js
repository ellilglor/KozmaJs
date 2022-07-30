const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rate: Number
});

module.exports = mongoose.model('rate', rateSchema, 'exchange');