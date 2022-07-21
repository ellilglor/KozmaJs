const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] 
});
client.commands = new Collection();
client.buttons = new Collection();

const handlerFiles = fs.readdirSync('./src/functions/handlers').filter(f => f.endsWith('.js'));
const botEventFiles = fs.readdirSync('./src/events/discord').filter(f => f.endsWith('.js'));
const dbEventFiles = fs.readdirSync('./src/events/database').filter(f => f.endsWith('.js'));
const commandFolders = fs.readdirSync('./src/commands');
const buttonFolders = fs.readdirSync('./src/buttons');

(async () => {
  for (file of handlerFiles) {
    require(`./functions/handlers/${file}`)(client);
  }

  client.handleEvents(botEventFiles);
  client.handleCommands(commandFolders);
  client.handleButtons(buttonFolders);
  client.dbLogin(dbEventFiles);
  client.login(process.env.TOKEN);
  client.keepAlive();
})();