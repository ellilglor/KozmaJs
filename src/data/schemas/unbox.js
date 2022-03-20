const mongoose = require('mongoose');
const boxSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  box: String,
  amount: {type: Number, default: 1}
});

module.exports = mongoose.model('box', boxSchema, 'boxes');