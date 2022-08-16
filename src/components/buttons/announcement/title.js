module.exports = {
  data: {
    name: 'announce-title'
  },
  async execute (interaction) {
    if (!interaction) return;

    let content = interaction.message.content;

    if (content.includes('title ❌')) {
      content = content.replace('title ❌', 'title ✅');
    } else {
      content = content.replace('title ✅', 'title ❌');
    }

    await interaction.update({ content: content });
  }
};