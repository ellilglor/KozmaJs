const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'punch-gamble'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = new EmbedBuilder(interaction.message.embeds[0]).setImage('');
    embed.setDescription('*These buttons let you roll for additional Unique Variants*');

    await interaction.update({ embeds: [embed] });
  }
};