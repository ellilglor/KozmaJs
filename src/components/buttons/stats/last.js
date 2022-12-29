const command = require(`@commands/kbp/stats`);

module.exports = {
  data: {
    name: 'last-stats'
  },
  async execute (interaction) {
    if (!interaction) return;

    await command.execute(interaction, 'last');
  }
};