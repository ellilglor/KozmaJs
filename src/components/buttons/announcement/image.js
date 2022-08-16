module.exports = {
  data: {
    name: 'announce-image'
  },
  async execute (interaction) {
    if (!interaction) return;

    let content = interaction.message.content;

    if (content.includes('image ❌')) {
      content = content.replace('image ❌', 'image ✅');
    } else {
      content = content.replace('image ✅', 'image ❌');
    }

    await interaction.update({ content: content });
  }
};