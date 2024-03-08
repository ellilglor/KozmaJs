const { ActivityType } = require('discord.js');
const dbRepo = require('@database/repos/dbRepo');
const { stillAlive } = require('@utils/functions');
const { checkTimedEvents, checkTradeMessages } = require('@services/timedActions/timedEvents');
const logger = require('@utils/logger');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({ activities: [{ name: '/help', type: ActivityType.Listening }], status: 'online' });

    logger.setLogChannel(client);
    
    await checkTradeMessages(client);
    
    const check = async () => {
      await checkTimedEvents(client);
      await dbRepo.checkExpiredMutes(client);
      await stillAlive(client);
      setTimeout(check, 1000 * 60 * 30);
    }
    await check();
	},
};