const command = require(`@commands/kbp/announcement`);

module.exports = {
  data: {
    name: 'announce-remake'
  },
  async execute (interaction) {
    if (!interaction) return;
    
    await command.execute(interaction);
  }
};