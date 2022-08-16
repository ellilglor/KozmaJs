module.exports = {
  data: {
    name: 'announce-desc'
  },
  async execute (interaction) {
    if (!interaction) return;

    let content = interaction.message.content;

    if (content.includes('description ❌')) {
      content = content.replace('description ❌', 'description ✅');
    } else {
      content = content.replace('description ✅', 'description ❌');
    }

    await interaction.update({ content: content });
  }
};