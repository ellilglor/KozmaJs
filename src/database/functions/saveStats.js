const mongoose = require('mongoose');
const command = require('@database/schemas/stats/command');
const item = require('@database/schemas/stats/findlogs');
const box = require('@database/schemas/stats/unbox');
const user = require('@database/schemas/stats/user');
const gambler = require('@database/schemas/stats/punch');
const { globals } = require('@utils/variables');
const { prices } = require('@commands/games/punch/data/punch');

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
  if (u.id === globals.ownerId) return;

  let gProfile = await gambler.findOne({ _id: u.id });

  if (!gProfile) {
    gProfile = new gambler({
      _id: u.id,
      tag: u.tag,
      ...(ticket === prices.single && { single: ticket }),
      ...(ticket === prices.double && { double: ticket }),
      ...(ticket === prices.triple && { triple: ticket }),
      total: ticket
    })
    
    await gProfile.save().catch(err => console.log(err));
  } else {
    try {
      switch (ticket) {
        case prices.single: await gambler.findOneAndUpdate({ _id: u.id }, { single: gProfile.single += ticket }); break;
        case prices.double: await gambler.findOneAndUpdate({ _id: u.id }, { double: gProfile.double += ticket }); break;
        case prices.triple: await gambler.findOneAndUpdate({ _id: u.id }, { triple: gProfile.triple += ticket }); break;
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