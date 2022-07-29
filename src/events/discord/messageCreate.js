const { giveMute } = require('../../functions/moderation/kbpTradeMute');
const { globals } = require('../../data/variables');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
    if (message.guildId !== globals.serverId || message.author.bot) return;

    const logChannel = client.channels.cache.get(globals.botLogsChannelId);

    try {
      if (!message.member) {
        await logChannel.send(`<@${globals.ownerId}> no member was found for ${message.url}`);
        return;
      }

      if (message.member.roles.cache.has(globals.adminId) || message.member.roles.cache.has(globals.modId)) return;

      switch (message.channelId) {
        case globals.wtbChannelId: await giveMute(message, logChannel); break;
        case globals.wtsChannelId: await giveMute(message, logChannel); break;
      }
      
    } catch (error) {
      await logChannel.send(`<@${globals.ownerId}> Error on msgCreate!\n${error}`);
      console.log(`Error on msgCreate!`, { error });
    };
	},
};