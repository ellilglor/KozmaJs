const command = require(`@commands/games/unbox/command`);

module.exports = {
  data: {
    name: 'unbox-stats'
  },
  async execute (interaction) {
    if (!interaction) return;

    const showStats = true;
    const box = interaction.message.embeds[0].author.name;
    const amount = interaction.message.embeds[0].fields[0].value;
    let spent = interaction.message.embeds[0].fields[1].value;

    spent = spent.includes('$') ? parseFloat(spent.replace('$', '')).toFixed(2) : parseInt(spent.replace(/,/g, ''));
    
    await command.execute(interaction, 'defer', showStats, box, amount, spent);
  }
};