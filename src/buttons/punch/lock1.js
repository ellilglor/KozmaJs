module.exports = {
  data: {
    name: 'punch-lock1'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    embed.description = ``;

    if (embed.fields[0].name.includes('🔒 UV #1')) {
      embed.fields[0].name = '🔓 UV #1';
    } else {
      embed.fields[0].name = '🔒 UV #1';
    }

    await interaction.update({ embeds: [embed] });
  }
};