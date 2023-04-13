const { ActivityType } = require('discord.js');
const { checkOldMessages } = require('@functions/moderation/kbpTradeMute');
const { dbCheckExpiredMutes } = require('@functions/database/tradeMute');
const { checkForNewLogs } = require('@functions/commands/update');
const { stillAlive } = require('@functions/general');
const { checkTimedEvents } = require('@functions/other/timedEvents');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({ activities: [{ name: '/help', type: ActivityType.Listening }], status: 'online' });
    client.keepAlive();
    
    await checkOldMessages(client);
    
    const check = async () => {
      await checkTimedEvents(client);
      await dbCheckExpiredMutes(client);
      await checkForNewLogs(client);
      await stillAlive(client);
      setTimeout(check, 1000 * 60 * 30);
    }
    await check();
	},
};