const mongoose = require('mongoose');
const command = require('@schemas/stats/command');
const item = require('@schemas/stats/findlogs');
const box = require('@schemas/stats/unbox');
const user = require('@schemas/stats/user');
const gambler = require('@schemas/stats/punch');
const { globals } = require('@data/variables');

const saveCommand = async (cmd) => {
  let commandProfile = await command.findOne({ command: cmd });

  if (!commandProfile) {
    commandProfile = new command({
      _id: mongoose.Types.ObjectId(),
      command: cmd,
    })
    await commandProfile.save().catch(err => console.log(err));
  } else {
    try {
      await command.findOneAndUpdate({ command: cmd }, { amount: commandProfile.amount += 1 });
    } catch (error) {
      console.log(error);
    }
  }
}

const saveSearched = async (searched) => {
  let itemProfile = await item.findOne({ item: searched });

  if (!itemProfile) {
    itemProfile = new item({
      _id: mongoose.Types.ObjectId(),
      item: searched,
    })
    await itemProfile.save().catch(err => console.log(err));
  } else {
    try {
      await item.findOneAndUpdate({ item: searched }, { amount: itemProfile.amount += 1 });
    } catch (error) {
      console.log(error);
    }
  }
}

const saveBox = async (opened) => {
  let boxProfile = await box.findOne({ box: opened });

  if (!boxProfile) {
    boxProfile = new box({
      _id: mongoose.Types.ObjectId(),
      box: opened,
    })
    await boxProfile.save().catch(err => console.log(err));
  } else {
    try {
      await box.findOneAndUpdate({ box: opened }, { amount: boxProfile.amount += 1 });
    } catch (error) {
      console.log(error);
    }
  }
}

const saveUser = async (u, command) => {
  let userProfile = await user.findOne({ _id: u.id });

  if (!userProfile) {
    userProfile = new user({
      _id: u.id,
      tag: u.tag,
      ...(command.includes('unbox') && { unboxed: 1 }),
      ...(command.includes('punch') && { punched: 1 }),
      ...((!command.includes('unbox') && !command.includes('punch')) && { amount: 1 })
    });

    await userProfile.save().catch(err => console.log(err));
  } else {
    try {
      switch (command) {
        case 'unbox': await user.findOneAndUpdate({ _id: u.id }, { unboxed: userProfile.unboxed += 1 }); break;
        case 'punch': await user.findOneAndUpdate({ _id: u.id }, { punched: userProfile.punched += 1 }); break;
        default: await user.findOneAndUpdate({ _id: u.id }, { amount: userProfile.amount += 1 });
      }
      
      if (userProfile.tag !== u.tag) await user.findOneAndUpdate({ _id: u.id }, { tag: u.tag });
    } catch (error) {
      console.log(error);
    }
  }
}

const saveGambler = async (u, ticket) => {
  if (u.tag === globals.ownerTag) return;

  let gProfile = await gambler.findOne({ _id: u.id });

  if (!gProfile) {
    gProfile = new gambler({
      _id: u.id,
      tag: u.tag,
      ...(ticket === 20000 && { single: ticket }),
      ...(ticket === 75000 && { double: ticket }),
      ...(ticket === 225000 && { triple: ticket }),
      total: ticket
    })
    
    await gProfile.save().catch(err => console.log(err));
  } else {
    try {
      switch (ticket) {
        case 20000: await gambler.findOneAndUpdate({ _id: u.id }, { single: gProfile.single += ticket }); break;
        case 75000: await gambler.findOneAndUpdate({ _id: u.id }, { double: gProfile.double += ticket }); break;
        case 225000: await gambler.findOneAndUpdate({ _id: u.id }, { triple: gProfile.triple += ticket }); break;
      }

      await gambler.findOneAndUpdate({ _id: u.id }, { total: gProfile.total += ticket });
      if (gProfile.tag !== u.tag) await gambler.findOneAndUpdate({ _id: u.id }, { tag: u.tag });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  saveCommand,
  saveSearched,
  saveBox,
  saveUser,
  saveGambler
}