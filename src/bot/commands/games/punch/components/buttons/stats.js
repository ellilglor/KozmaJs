const { EmbedBuilder } = require('discord.js');
const { getPlayer } = require('../../functions/punch');

module.exports = {
  data: {
    name: 'punch-stats'
  },
  async execute (interaction) {
    if (!interaction) return;
    
    const embed = getPlayer(interaction, EmbedBuilder.from(interaction.message.embeds[0]).setImage(null));

    await interaction.editReply({ embeds: [embed] });
  }
};