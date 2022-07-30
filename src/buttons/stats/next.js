const command = require(`@commands/kbp/stats`);

module.exports = {
  data: {
    name: 'next-stats'
  },
  async execute (interaction) {
    if (!interaction) return;

    await command.execute(interaction, 'next');
  }
};