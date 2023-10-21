const tradelog = require('@database/schemas/commands/tradelogs');

const createLog = (msg) => {
  const profile = new tradelog({
     _id: msg.id,
    channel: msg.channel,
    author: msg.author,
    date: msg.date,
    messageUrl: msg.url,
    content: msg.content,
    original: msg.original,
    image: msg.image
  });

  return profile;
}

const saveLogs = async (logs, channel, clear) => {
  if (clear) await tradelog.deleteMany({ channel: channel });
  await tradelog.insertMany(logs);
}

const checkLog = (id) => {
  return tradelog.exists({ _id: id });
}

const findLogs = async (matches, date, checkMixed, skipSpecial, ignore) => {
  const data = await tradelog.aggregate([
    { $match: { $and: [
      { content: { $regex: matches, $options: 'i' } },
      { date: { $gt: date } },
      { ...(!checkMixed && { channel: { $ne: 'mixed-trades' } }) },
      { ...(skipSpecial && { channel: { $ne: 'special-listings' } }) },
      { ...(ignore.length > 2 && { content: { $not: {$regex: ignore } } }) }
    ]}},
    { $sort: {
      date: -1
    }},
    { $group: {
      _id: '$channel',
      messages: { $push: '$$ROOT' }
    }},
    { $sort: {
      _id: -1
    }}
  ]);

  return data;
}

module.exports = {
  createLog,
  saveLogs,
  checkLog,
  findLogs,
}