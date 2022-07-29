const { EmbedBuilder } = require('discord.js');
const { saveUser } = require('./database/user');
const { saveCommand, saveSearched, saveBox } = require('./database/stats');
const { globals } = require('../data/variables');

const buildEmbed = () => {
  const embed = new EmbedBuilder()
    .setColor('#29D0FF')
    .setFooter({ 
      text: `Thank you for using Kozma's Backpack bot!`, 
      iconURL: 'https://cdn.discordapp.com/attachments/713080672893534281/884813303132606474/logo.png'
    });
  return embed;
};

const tradelogEmbed = () => {
  const embed = new EmbedBuilder().setColor('#29D0FF');
  return embed;
};

const noPermission = (embed) => {
  embed
    .setTitle(`You don't have permission to use this command!`)
    .setColor('#e74c3c');
  return embed;
};

const logCommand = async ({ client, options, member, user, commandName, message: msg }, extra, item) => {
  if (user.tag === globals.ownerTag) return
  const logChannel = client.channels.cache.get(globals.botLogsChannelId);
  const location = member ? member.guild.name : 'DM';
  const command = commandName || msg.interaction.commandName || msg.interaction.name;

  let option = '';
  if (options) {
    for (const opt of options._hoistedOptions) {
      option += ` ${opt.value}`;
    }
  }
  if (extra) option += ` ${extra}`;

  await saveData(user, command, option);
  
  if (item) option += ` ${item}`;

  const message = `${user.tag} used /${command}${option} in ${location}`;
  console.log(message);
  await logChannel.send(message.slice(0,2000));
};

const saveData = async (user, command, option) => {
  await saveUser(user, command);
  await saveCommand(command);

  if (command.includes('findlogs')) {
    option = option.replace(/[0-9]/g, '')
      .replace(' variant-search', '')
      .replace(' single-search', '');
    option = contentFilter(option);

    await saveSearched(option);
  } else if (command.includes('unbox')) {
    await saveBox(option);
  }
}

const contentFilter = (content) => {
	result = content.replace(/['"\+\[\]()\-{},]/g, "").toLowerCase();

	if (result.includes('gm')) result = result.replace('gm', '').concat(' ', 'asi vh ctr vh');

	result = result
		.replace("  ", " ")
		.replace("mixer", "overcharged mixmaster")
		.replace(/vh/g, "very high")
		.replace("bkc", "black kat cowl")
		.replace("bkr", "black kat raiment")
		.replace("bkm", "black kat mail")
		.trim();

	return result;
};

module.exports = {
  buildEmbed,
  tradelogEmbed,
  noPermission,
  logCommand,
  contentFilter
};