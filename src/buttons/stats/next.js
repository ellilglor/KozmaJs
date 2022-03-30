const command = require(`../../commands/kbp/stats`);

module.exports = {
  data: {
    name: 'next-stats'
  },
  async execute (interaction) {
    if (!interaction) { return; }

    const button = 'next';

    await command.execute(interaction, button);
  }
};