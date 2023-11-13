const { ActivityType } = require('discord.js');
const { checkOldMessages } = require('@services/moderation/kbpTradeMute');
const { dbCheckExpiredMutes } = require('@database/functions/tradeMute');
const { checkForNewLogs } = require('@commands/kbp/update/functions/update');
const { stillAlive } = require('@utils/functions');
const { checkTimedEvents } = require('@services/timedActions/timedEvents');
const logger = require('@utils/logger');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({ activities: [{ name: '/help', type: ActivityType.Listening }], status: 'online' });

    logger.setLogChannel(client);
    
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