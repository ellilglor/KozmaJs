module.exports = {
  data: {
    name: 'announce-link'
  },
  async execute (interaction) {
    if (!interaction) return;

    let content = interaction.message.content;

    if (content.includes('link ❌')) {
      content = content.replace('link ❌', 'link ✅');
    } else {
      content = content.replace('link ✅', 'link ❌');
    }

    await interaction.update({ content: content });
  }
};