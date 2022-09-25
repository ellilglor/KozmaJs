const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'punch-info'
  },
  async execute (interaction) {
    if (!interaction) return;
    
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setImage(null)
      .setDescription(
        '*These are the chances to get Unique Variants*\n\n' +
        '**When rolling at punch:**\n' +
        '- Low: ~ 73.17%\n- Medium: ~ 19.51%\n- High: ~ 4.87%\n- Very High/Maximum: ~ 2.45%\n\n' +
        '**When crafting:**\n- 1/10 for 1 UV\n- 1/100 for 2 UVs\n- 1/1000 for 3 UVs');

    await interaction.update({ embeds: [embed] });
  }
};