const { giveMute } = require('@services/moderation/kbpTradeMute');
const { globals } = require('@utils/variables');

const kbp = async (message, logChannel) => {
  if (message.author.bot) {
    switch (message.channelId) {
      case globals.marketChannelId: message.crosspost(); break;
    }
  } else {
    switch (message.channelId) {
      case globals.wtbChannelId: await giveMute(message, logChannel); break;
      case globals.wtsChannelId: await giveMute(message, logChannel); break;
    }
  }
}

module.exports = {
  kbp
}