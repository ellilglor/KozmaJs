const { giveBuyMute, giveSellMute } = require('../../functions/moderation/kbpTradeMute');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
    const kbpId = '760222722919497820', botId = '898505614404235266';
    
    if (message.guildId !== kbpId || message.author.id === botId) return;
    if (message.channelId.includes('824371721003991050')) return;

    const logChannel = client.channels.cache.get(process.env.botLogs);
    const wtbChnl = '872172994158538812', wtsChnl = '872173055386980373';

    try {
      const admin = '760222967808131092', mod = '796399775959220304';

      if (message.member.roles.cache.has(admin) || message.member.roles.cache.has(mod)) return;
      
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