const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: {
    name: 'punch-lock'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = new MessageEmbed(interaction.message.embeds[0]).setImage('');
    embed.setDescription('*These buttons let you lock/unlock a Unique Variant*')

    await interaction.update({ embeds: [embed] });
  }
};