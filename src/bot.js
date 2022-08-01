const { Client, GatewayIntentBits: Int, Collection } = require('discord.js');
const fs = require('fs');
require('module-alias/register');
require('dotenv').config();

const client = new Client({ intents: [Int.Guilds, Int.GuildMessages, Int.GuildMembers] });
client.commands = new Collection();
client.buttons = new Collection();

const handlerFiles = fs.readdirSync('./src/functions/handlers').filter(f => f.endsWith('.js'));
const botEventFiles = fs.readdirSync('./src/events/discord').filter(f => f.endsWith('.js'));
const dbEventFiles = fs.readdirSync('./src/events/database').filter(f => f.endsWith('.js'));
const commandFolders = fs.readdirSync('./src/commands');
const buttonFolders = fs.readdirSync('./src/buttons');

(async () => {
  handlerFiles.forEach(f => { require(`./functions/handlers/${f}`)(client) });

  //testing to auto restart on ratelimit - remains to be broken
  //client.rest.on('ratelimited', data => { if (data.timeout > 1000) process.kill(1) });
  client.rest.on('ratelimited', data => { console.log("ratelimited") });

  client.handleEvents(botEventFiles);
  client.handleCommands(commandFolders);
  client.handleButtons(buttonFolders);
  client.dbLogin(dbEventFiles);
  client.login(process.env.TOKEN);
  client.keepAlive();
})();