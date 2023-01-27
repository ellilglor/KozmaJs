const { EmbedBuilder } = require('discord.js');
const { saveCommand, saveSearched, saveBox } = require('@functions/database/saveStats');
const { saveUser } = require('@functions/database/user');
const { filters } = require('@structures/findlogs');
const { globals } = require('@data/variables');
const fs = require('fs');

const buildEmbed = ({ client }) => {
  return new EmbedBuilder()
    .setColor('#29D0FF')
    .setFooter({ 
      text: `Thank you for using ${client.user.username} bot!`, 
      iconURL: client.user.displayAvatarURL()
    });
};

const tradelogEmbed = () => {
  return new EmbedBuilder().setColor('#29D0FF');
};

const logCommand = async ({ client, options, member, user, commandName, message: msg, locale }, extra, item) => {
  if (user.tag === globals.ownerTag) return;
  const logChannel = client.channels.cache.get(globals.botLogsChannelId);
  const location = member?.guild.name || 'DM';
  const command = commandName || msg.interaction.commandName || msg.interaction.name;

  let option = options?._hoistedOptions.reduce((s, opt) => s.concat(' ', opt.value), '') || '';
  if (extra) option += ` ${extra}`;

  await saveData(user, command, option);
  
  if (item) option += ` ${item}`;

  const message = `${user.tag} used /${command}${option} in ${location} - ${locale}`;
  console.log(message);
  await logChannel.send(message.slice(0,2000));
};

const saveData = async (user, command, option) => {
  await saveUser(user, command);
  await saveCommand(command);

  switch (command) {
    case 'findlogs':
      option = option.replace(/[0-9]/g, '').replace(' variant-search', '').replace(' single-search', '');
      option = option.replace(' mixed-search', '').replace(' mixed-ignore', '');
      option = contentFilter(option);
      await saveSearched(option); break;
    case 'unbox':
      await saveBox(option.trim()); break;
  }
}

const getLanguage = (locale) => {
  switch (locale) {
    case 'it': return JSON.parse(fs.readFileSync('src/data/languages/italian.json'));
    case 'nl': return JSON.parse(fs.readFileSync('src/data/languages/dutch.json'));
    default: return JSON.parse(fs.readFileSync('src/data/languages/english.json'));
  }
}

const contentFilter = (content) => {
  let result = content
    .replace(/vh/g, "very high")
    .replace(/['"’\+\[\]()\-{},]/g, '').replace(/ {2,}/g, ' ')
    .trim().toLowerCase();

  for (const check of filters) {
    if (result.includes(check.old) && !result.includes(check.exclude)) result = result.replace(check.old, check.new);
  }

	return result;
};

const stillAlive = async (client) => {
  const logChannel = client.channels.cache.get(globals.botLogsChannelId);
  const message = await logChannel.messages.fetch({ limit: 1 });
  const timestamp = Math.round(client.readyTimestamp/1000);
  const msg = message.first();
  const time = msg.createdAt;
  const date = new Date();
  
  time.setMinutes(time.getMinutes() + 29);

  if (date > time) logChannel.send(`**Connected since <t:${timestamp}:f> with ${client.ws.ping}ms ping.**`);
}

module.exports = {
  buildEmbed,
  tradelogEmbed,
  logCommand,
  getLanguage,
  contentFilter,
  stillAlive
};