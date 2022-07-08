const { rollUv } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble3'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];

    embed.description = ``;

    for (const field of embed.fields) {
      if (field.name.includes('🔒 UV #1')) {
        field.name = field.name.replace('🔒', '🔓');
      } else if (field.name.includes('🔓 UV #1')) {
        field.name = field.name.replace('🔓', '🔒');
      }
    }

    await interaction.update({ embeds: [embed] });
  }
};