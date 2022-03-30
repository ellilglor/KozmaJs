const rate = require('../../data/schemas/commands/rate');

const saveRate = async (r) => {
  try {
    await rate.findOneAndUpdate({ _id: '62389702e725f74faaf731b1'}, { rate: r});
  } catch (error) {
    console.log(error);
  }
}

const getRate = async () => {
  try {
    result = await rate.findOne({ _id: '62389702e725f74faaf731b1'});
  } catch (error) {
    console.log(error);
  }

  return result.rate;
}

module.exports = {
  saveRate,
  getRate
}