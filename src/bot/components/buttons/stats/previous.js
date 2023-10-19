const command = require(`@commands/kbp/stats`);

module.exports = {
  data: {
    name: 'prev-stats'
  },
  async execute (interaction) {
    if (!interaction) return;

    await command.execute(interaction, 'defer', 'previous');
  }
};