const { giveBuyMute, giveSellMute } = require('../../functions/moderation/kbpTradeMute')
const kbpId = '760222722919497820';
const botId = '898505614404235266';
const wtbChnl = '872172994158538812';
const wtsChnl = '872173055386980373';

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
    if (message.guildId !== kbpId) return
    if (message.author.id === botId) return

    const logChannel = client.channels.cache.get(process.env.botLogs);

    try {
      if (message.channelId === wtbChnl) { 
        await giveBuyMute(message, logChannel);
      } else if (message.channelId === wtsChnl) { 
        await giveSellMute(message, logChannel);
      }
    } catch (error) {
      await logChannel.send(`<@214787913097936896> Error on msgCreate!\n${error}`);
      console.log(`Error on msgCreate!`, { error });
    };
	},
};