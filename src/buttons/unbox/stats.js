const command = require(`@commands/games/unbox`);

module.exports = {
  data: {
    name: 'unbox-stats'
  },
  async execute (interaction) {
    if (!interaction) return;
    
    const box = interaction.message.embeds[0].author.name;
    const amount = interaction.message.embeds[0].fields[0].value;
    let spent = interaction.message.embeds[0].fields[1].value;
    const showStats = true;

    spent = spent.includes('Energy') ? parseInt(spent) : parseFloat(spent.replace("$", "")).toFixed(2);
    
    await command.execute(interaction, showStats, box, amount, String(spent));
  }
};