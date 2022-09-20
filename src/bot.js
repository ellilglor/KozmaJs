const { Client, GatewayIntentBits: Int, Collection } = require('discord.js');
const fs = require('fs');
require('module-alias/register');
require('dotenv').config();

const client = new Client({ intents: [Int.Guilds, Int.GuildMessages, Int.GuildMembers, Int.MessageContent] });
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

const handlerFiles = fs.readdirSync('./src/functions/handlers').filter(f => f.endsWith('.js'));
const botEventFiles = fs.readdirSync('./src/events/discord').filter(f => f.endsWith('.js'));
const dbEventFiles = fs.readdirSync('./src/events/database').filter(f => f.endsWith('.js'));
const componentFolders = fs.readdirSync('./src/components');
const commandFolders = fs.readdirSync('./src/commands');

(async () => {
  handlerFiles.forEach(file => require(`./functions/handlers/${file}`)(client));

  client.rest.on?.("rateLimited", ({ timeToReset, global }) => {
    if (timeToReset > 10000 && !global) {
      process.emitWarning("Rate limit: restarting");
      get(
        `http://cd594a2f-0e9f-48f1-b3eb-e7f6e8665adf.id.repl.co/${process.env.REPL_ID}`,
        () => process.kill(1)
      );
    }
  });

  await client.dbLogin(dbEventFiles);
  client.handleEvents(botEventFiles);
  client.handleCommands(commandFolders);
  client.handleComponents(componentFolders);
  client.login(process.env.botToken);
  //client.keepAlive();
})();