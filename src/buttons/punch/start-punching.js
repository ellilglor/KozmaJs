module.exports = {
  data: {
    name: 'start-punching'
  },
  async execute (interaction) {
    if (!interaction) { return; }
    await interaction.update({ content: 'Start rolling was clicked!', components: [] });
  }
};