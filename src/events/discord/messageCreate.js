const { giveBuyMute, giveSellMute } = require('../../functions/moderation/kbpTradeMute')
const kbpId = '760222722919497820';

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
    if (message.guildId !== kbpId) { return }

    const logChannel = client.channels.cache.get(process.env.botLogs);

    try {
      // if (message.channelId === '879297439054581770') { 
      //   await giveBuyMute(message, logChannel);
      // }
      if (message.channelId === '872172994158538812') { 
        await giveBuyMute(message, logChannel);
      } else if (message.channelId === '872173055386980373') { 
        await giveSellMute(message, logChannel);
      }
    } catch (error) {
      await logChannel.send(`<@214787913097936896> Error on msgCreate!\n${error}`);
      console.log(`Error on msgCreate!`, { error });
    };
	},
};