module.exports = {
  data: {
    name: 'punch-lock2'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    embed.description = ``;

    if (embed.fields[1].name.includes('🔒 UV #2')) {
      embed.fields[1].name = '🔓 UV #2';
    } else {
      embed.fields[1].name = '🔒 UV #2';
    }

    await interaction.update({ embeds: [embed] });
  }
};