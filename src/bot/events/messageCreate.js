const { knightlauncher } = require('@functions/messages/knightlauncher');
const { kbp } = require('@functions/messages/kbp');
const { globals } = require('@utils/variables');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
    try {
      const logChannel = client.channels.cache.get(globals.botLogsChannelId);

      switch (message.guildId) {
        case '653349356459786240': await knightlauncher(message); break;
        case globals.serverId: await kbp(message, logChannel); break;
      }
    } catch (error) {
      await logChannel.send(`<@${globals.ownerId}> Error on msgCreate!\n${error}`);
      console.log('\u001b[31mError on msgCreate!\n\u001b[0m', { error });
    };
	},
};