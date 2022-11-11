const { giveMute } = require('@functions/moderation/kbpTradeMute');
const { updateRate } = require('@functions/commands/update');
const { globals } = require('@data/variables');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
    if (message.guildId !== globals.serverId || message.author.bot) return;

    // if (message.author.tag == 'Watergoose#3657') {
    //   await message.react('🤓');
    //   await message.react('🦢');
    //   await message.react('<:check:858090390254780447>');
    //   await message.react('☑️');
    //   await message.react('✔️');
    //   await message.react('✅');
    // }

    const logChannel = client.channels.cache.get(globals.botLogsChannelId);

    try {
      if (!message.member) {
        await logChannel.send(`<@${globals.ownerId}> no member was found for ${message.url}`);
        return;
      }

      switch (message.channelId) {
        case globals.wtbChannelId: await giveMute(message, logChannel); break;
        case globals.wtsChannelId: await giveMute(message, logChannel); break;
        case globals.marketChannelId: await updateRate(message, logChannel); break;
      }
      
    } catch (error) {
      await logChannel.send(`<@${globals.ownerId}> Error on msgCreate!\n${error}`);
      console.log('\u001b[31mError on msgCreate!\n\u001b[0m', { error });
    };
	},
};