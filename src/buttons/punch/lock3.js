module.exports = {
  data: {
    name: 'punch-lock3'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    embed.description = ``;

    if (embed.fields[2].name.includes('🔒 UV #3')) {
      embed.fields[2].name = '🔓 UV #3';
    } else {
      embed.fields[2].name = '🔒 UV #3';
    }

    await interaction.update({ embeds: [embed] });
  }
};