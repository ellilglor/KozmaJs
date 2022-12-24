const gambler = require('@schemas/stats/punch');
const { globals } = require('@data/variables');

const saveGambler = async (u, ticket) => {
  if (u.tag === globals.ownerTag) return;

  let gProfile = await gambler.findOne({ _id: u.id });

  if (!gProfile) {
    gProfile = await new gambler({
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

const getGamblers = async () => {
  const result = await gambler.find();

  result.sort((a, b) => { return b.total - a.total });

  return result;
}

module.exports = {
  saveGambler,
  getGamblers
}