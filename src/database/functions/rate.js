const rate = require('@database/schemas/commands/rate');

const DATABASE_RATE_ID = '62389702e725f74faaf731b1';

const saveRate = async (r) => {
  try {
    await rate.findOneAndUpdate({ _id: DATABASE_RATE_ID }, { rate: r });
  } catch (error) {
    console.log(error);
  }
}

const getRate = async () => {
  try {
    data = await rate.findOne({ _id: DATABASE_RATE_ID });
  } catch (error) {
    console.log(error);
  }

  return data.rate;
}

module.exports = {
  saveRate,
  getRate
}