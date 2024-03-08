const schema = require('../schemas/commands/tradelogs');

class tradelogRepo {
    createLog(msg) {
        const profile = new schema({
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

    async saveLogs(logs, channel, clear) {
        if (clear) await schema.deleteMany({ channel: channel });
        await schema.insertMany(logs);
    }

    checkIfLogExists(id)  {
        return schema.exists({ _id: id });
    }

    async findLogs(matches, date, checkMixed, skipSpecial, ignore) {
        const data = await schema.aggregate([
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
}

module.exports = tradelogRepo;