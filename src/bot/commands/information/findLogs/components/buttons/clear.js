const command = require('@commands/other/clear/command');

module.exports = {
  data: {
    name: 'clear-messages'
  },
  async execute (interaction) {
    if (!interaction) return;

    await command.execute(interaction);
  }
};