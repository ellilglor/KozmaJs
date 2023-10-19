const { Client, GatewayIntentBits: Int, Collection } = require('discord.js');
const fs = require('fs');
require('module-alias/register');
require('dotenv').config();

const client = new Client({ intents: [Int.Guilds, Int.GuildMessages, Int.GuildMembers, Int.MessageContent] });
client.commands = new Collection();
client.buttons = new Collection();

const handlerFiles = fs.readdirSync('./src/functions/handlers').filter(f => f.endsWith('.js'));
const botEventFiles = fs.readdirSync('./src/events/discord').filter(f => f.endsWith('.js'));
const dbEventFiles = fs.readdirSync('./src/database/events').filter(f => f.endsWith('.js'));
const componentFolders = fs.readdirSync('./src/components');
const commandFolders = fs.readdirSync('./src/commands');

(async () => {
  handlerFiles.forEach(file => require(`./functions/handlers/${file}`)(client));

  await client.dbLogin(dbEventFiles);
  client.handleEvents(botEventFiles);
  client.handleCommands(commandFolders);
  client.handleComponents(componentFolders);
  client.login(process.env.botToken);
  client.on('debug', console.log)
      .on('warn', console.log)
})();