const { lockUv } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-lock1'
  },
  async execute (interaction) {
    if (!interaction) return;

    await lockUv(interaction, 1);
  }
};