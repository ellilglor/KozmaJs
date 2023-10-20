const { lockUv } = require('../../functions/punch');

module.exports = {
  data: {
    name: 'punch-lock3'
  },
  async execute (interaction) {
    if (!interaction) return;

    await lockUv(interaction, 3);
  }
};