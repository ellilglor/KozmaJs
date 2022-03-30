const mongoose = require('mongoose');
const user = require('../../data/schemas/stats/user');

const saveUser = async (u, command) => {
  let userProfile = await user.findOne({ _id: u.id });

  if (!userProfile) {
    userProfile = command.includes('unbox') ? 
      await new user({
        _id: u.id,
        tag: u.tag,
        unboxed: 1,
      }) : 
      await new user({
        _id: u.id,
        tag: u.tag,
        amount: 1,
      })
    await userProfile.save().catch(err => console.log(err));
  } else {
    try {
      if (command.includes('unbox')) {
        await user.findOneAndUpdate({ _id: u.id}, { unboxed: userProfile.unboxed += 1});
      } else {
        await user.findOneAndUpdate({ _id: u.id}, { amount: userProfile.amount += 1});
      }
      
      if (userProfile.tag !== u.tag) {
        await user.findOneAndUpdate({ _id: u.id}, { tag: u.tag});
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const getUsers = async () => {
  const result = await user.find();

  result.sort((a, b) => {
    return b.amount - a.amount;
  });

  return result;
}

module.exports = {
  saveUser,
  getUsers
}