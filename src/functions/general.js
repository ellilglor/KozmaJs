const { MessageEmbed } = require('discord.js');

const buildEmbed = () => {
  const embed = new MessageEmbed()
    .setColor('#29D0FF')
    .setFooter({ text: `Thank you for using Kozma's Backpack bot!`, iconURL: 'https://cdn.discordapp.com/attachments/713080672893534281/884813303132606474/logo.png'});
  return embed;
};

const tradelogEmbed = () => {
  const embed = new MessageEmbed()
    .setColor('#29D0FF');
  return embed;
};

const noPermission = (embed) => {
  embed.setTitle(`You don't have permission to use this command!`)
    .setColor('#e74c3c');
  return embed;
};

const logCommand = async ({ client, options, member, user, commandName, message: msg }, extra, item) => {
  if (user.tag === 'ellilglor#6866') { return }
  const logChannel = client.channels.cache.get(process.env.botLogs);
  const location = member ? member.guild.name : 'DM';
  const command = commandName || msg.interaction.commandName || msg.interaction.name;

  let option = '';
  if (options) {
    for (const opt of options._hoistedOptions) {
      option += ` ${opt.value}`;
    }
  }
  if (extra) { option += ` ${extra}`; }
  if (item) { option += ` ${item}`; }

  const message = `${user.tag} used /${command}${option} in ${location}`;

  console.log(message);
  await logChannel.send(message.slice(0,2000));
};

module.exports = {
  buildEmbed,
  tradelogEmbed,
  noPermission,
  logCommand,
};