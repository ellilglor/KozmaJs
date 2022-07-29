const { ActivityType } = require('discord.js');
const { dbCheckExpiredMutes } = require('../../functions/database/tradeMute');
const { checkOldMessages } = require('../../functions/moderation/kbpTradeMute');
const { checkForNewLogs } = require('../../functions/commands/update');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({ activities: [{ name: '/help', type: ActivityType.Listening }], status: 'online' });
    await checkOldMessages(client);
    
    const check = async () => {
      await dbCheckExpiredMutes(client);
      await checkForNewLogs(client);
      setTimeout(check, 1000 * 60 * 30);
    }
    check();
	},
};