const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'punch-lock'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = new EmbedBuilder(interaction.message.embeds[0]).setImage('');
    embed.setDescription('*These buttons let you lock/unlock a Unique Variant*')

    await interaction.update({ embeds: [embed] });
  }
};