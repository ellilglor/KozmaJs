const command = require(`../../commands/kbp/stats`);

module.exports = {
  data: {
    name: 'prev-stats'
  },
  async execute (interaction) {
    if (!interaction) { return; }

    const button = 'previous';

    await command.execute(interaction, button);
    //await interaction.update({ content: 'next', components: [] });
  }
};