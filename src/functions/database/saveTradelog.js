const mongoose = require('mongoose');
const tradelog = require('../../data/schemas/tradelog');

const saveTradelog = (message) => {
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

// module.exports = (client) => {
//   client.saveTradelog = async (message) => {
//     let tradelogProfile = await tradelog.findOne({ _id: message.discordId });

//     if (!tradelogProfile) {
//       tradelogProfile = await new tradelog({
//         _id: message.discordId,
//         channel: message.channel,
//         date: message.date,
//         messageUrl: message.messageUrl,
//         content: message.content,
//         image: message.image
//       })

//       await tradelogProfile.save().catch(err => console.log(err));
//     }
//   }
// }