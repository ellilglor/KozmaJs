const { giveMute } = require('@functions/moderation/kbpTradeMute');
const { updateRate } = require('@functions/commands/update');
const { globals } = require('@data/variables');

const kbp = async (message, logChannel) => {
  if (message.author.bot) return;
  
  switch (message.channelId) {
    case globals.wtbChannelId: await giveMute(message, logChannel); break;
    case globals.wtsChannelId: await giveMute(message, logChannel); break;
    case globals.marketChannelId: await updateRate(message, logChannel); break;
  }
}


module.exports = {
  kbp
}