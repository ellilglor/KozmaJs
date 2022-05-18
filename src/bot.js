const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
client.commands = new Collection();
client.buttons = new Collection();

const handlerFiles = fs.readdirSync('./src/functions/handlers').filter(file => file.endsWith('.js'));
const botEventFiles = fs.readdirSync('./src/events/discord').filter(file => file.endsWith('.js'));
const dbEventFiles = fs.readdirSync('./src/events/database').filter(file => file.endsWith('.js'));
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