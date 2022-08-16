module.exports = {
  data: {
    name: 'announce-date'
  },
  async execute (interaction) {
    if (!interaction) return;

    let content = interaction.message.content;

    if (content.includes('date ❌')) {
      content = content.replace('date ❌', 'date ✅');
    } else {
      content = content.replace('date ✅', 'date ❌');
    }

    await interaction.update({ content: content });
  }
};