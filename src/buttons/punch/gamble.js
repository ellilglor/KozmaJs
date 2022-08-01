const { EmbedBuilder } = require('discord.js');
const { getLanguage } = require('@functions/general');

module.exports = {
  data: {
    name: 'punch-gamble'
  },
  async execute (interaction) {
    if (!interaction) return;
    
    const lan = getLanguage(interaction.locale).punch;
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setImage(null).setDescription(lan.gambleDesc);

    await interaction.update({ embeds: [embed] });
  }
};