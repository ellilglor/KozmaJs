module.exports = {
  data: {
    name: 'punch-lock2'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];

    for (const field of embed.fields) {
      if (field.name.includes('🔒 UV #2')) {
        field.name = field.name.replace('🔒', '🔓');
      } else if (field.name.includes('🔓 UV #2')) {
        field.name = field.name.replace('🔓', '🔒');
      }
    }

    await interaction.update({ embeds: [embed] });
  }
};