const command = require(`@commands/kbp/stats/command`);

module.exports = {
  data: {
    name: 'first-stats'
  },
  async execute (interaction) {
    if (!interaction) return;

    await command.execute(interaction, 'defer', 'first');
  }
};