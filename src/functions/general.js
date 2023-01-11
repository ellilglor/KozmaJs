const { EmbedBuilder } = require('discord.js');
const { saveCommand, saveSearched, saveBox } = require('@functions/database/stats');
const { saveUser } = require('@functions/database/user');
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
	result = content.replace(/['"’\+\[\]()\-{},]/g, "").toLowerCase();

	if (result.includes('orbitgun') && !result.includes('celestial')) result = result.replace('orbitgun', 'celestial orbitgun');
  if (result.includes('mixmaster') && !result.includes('overcharged')) result = result.replace('mixmaster', 'overcharged mixmaster');
  if (result.includes('totem') && !result.includes('somnambulists')) result = result.replace('totem', 'somnambulists totem');
  if (result.includes('soaker') && !result.includes('spiral')) result = result.replace('soaker', 'spiral soaker');
  if (result.includes('blitz') && !result.includes('needle')) result = result.replace('blitz', 'blitz needle');
  if (result.includes('calad') && !result.includes('caladbolg')) result = result.replace('calad', 'caladbolg');
  if (result.includes('daybreaker') && !result.includes('band')) result = result.replace('daybreaker', 'daybreaker band');

  if (result.includes('ctr m') && !result.includes('ctr med')) result = result.replace('ctr m', 'ctr med');
  if (result.includes('ctr h') && !result.includes('ctr high')) result = result.replace('ctr h', 'ctr high');
  if (result.includes('asi m') && !result.includes('asi med')) result = result.replace('asi m', 'asi med');
  if (result.includes('asi h') && !result.includes('asi high')) result = result.replace('asi h', 'asi high');
  
	result = result
    .replace(' gm', ' asi very high ctr very high').replace('gm ', 'asi very high ctr very high ')
		.replace(/vh/g, "very high").replace('ctr very high asi very high', 'asi very high ctr very high')
    .replace('medium', 'med').replace('maximum', 'max')
    .replace("mixer", "overcharged mixmaster")
		.replace('bkc', 'black kat cowl').replace('bkr', 'black kat raiment').replace('bkm', 'black kat mail')
    .replace('ssb', 'swiftstrike buckler').replace('btb', 'barbarous thorn blade')
    .replace(/ {2,}/g, ' ').trim(); // remove whitespace

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