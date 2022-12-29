const user = require('@schemas/stats/user');

const saveUser = async (u, command) => {
  let userProfile = await user.findOne({ _id: u.id });

  if (!userProfile) {
    userProfile = await new user({
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

const getUsers = async () => {
  const result = await user.find();

  result.sort((a, b) => { return b.amount - a.amount });

  return result;
}

module.exports = {
  saveUser,
  getUsers
}