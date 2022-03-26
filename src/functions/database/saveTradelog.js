const mongoose = require('mongoose');
const tradelog = require('../../data/schemas/commands/tradelog');

const saveTradelog = async (message) => {
  let tradelogProfile = await tradelog.findOne({ _id: message.discordId });

  if (!tradelogProfile) {
    tradelogProfile = await new tradelog({
      _id: message.discordId,
      channel: message.channel,
      date: message.date,
      messageUrl: message.messageUrl,
      content: message.content,
      image: message.image
    })

    await tradelogProfile.save().catch(err => console.log(err));
  }
}

module.exports = {
  saveTradelog
}