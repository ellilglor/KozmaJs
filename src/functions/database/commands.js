const mongoose = require('mongoose');
const command = require('../../data/schemas/command');
const item = require('../../data/schemas/findlogs');
const box = require('../../data/schemas/unbox');

const saveCommand = async (cmd) => {
  let commandProfile = await command.findOne({ command: cmd });

  if (!commandProfile) {
    commandProfile = await new command({
      _id: mongoose.Types.ObjectId(),
      command: cmd,
    })
    await commandProfile.save().catch(err => console.log(err));
  } else {
    try {
      await command.findOneAndUpdate({ command: cmd}, { amount: commandProfile.amount += 1});
    } catch (error) {
      console.log(error);
    }
  }
}

const saveSearched = async (searched) => {
  let itemProfile = await item.findOne({ item: searched });

  if (!itemProfile) {
    itemProfile = await new item({
      _id: mongoose.Types.ObjectId(),
      item: searched,
    })
    await itemProfile.save().catch(err => console.log(err));
  } else {
    try {
      await item.findOneAndUpdate({ item: searched}, { amount: itemProfile.amount += 1});
    } catch (error) {
      console.log(error);
    }
  }
}

const saveBox = async (opened) => {
  let boxProfile = await box.findOne({ box: opened });

  if (!boxProfile) {
    boxProfile = await new box({
      _id: mongoose.Types.ObjectId(),
      box: opened,
    })
    await boxProfile.save().catch(err => console.log(err));
  } else {
    try {
      await box.findOneAndUpdate({ box: opened}, { amount: boxProfile.amount += 1});
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  saveCommand,
  saveSearched,
  saveBox
}