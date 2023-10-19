const mongoose = require('mongoose');
const event = require('@database/schemas/timedEvents');

const insertEvent = async (name) => {
  const profile = new event({
    _id: mongoose.Types.ObjectId(),
    name: name,
  });

  await profile.save().catch(err => console.log(err));
}

const getEvent = async (name) => {
  return await event.findOne({ name: name });
}

const updateEvent = async (name) => {
  await event.findOneAndUpdate({ name: name }, { $inc: { 'executed': 1 } });
}

module.exports = {
  insertEvent,
  getEvent,
  updateEvent
}