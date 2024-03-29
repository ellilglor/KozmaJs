const command = require(`@commands/games/punch/command`);

module.exports = {
  data: {
    name: 'recraft'
  },
  async execute (interaction) {
    if (!interaction) return;

    const item = interaction.message.embeds[0].title.replace('You crafted: ', '');
    const field = interaction.message.embeds[0].fields.find(f => f.name === 'Amount crafted');
    const amount = String(parseInt(field.value) + 1);

    await command.execute(interaction, 'defer', item, amount);
  }
};