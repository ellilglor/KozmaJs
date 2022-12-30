const { lockboxes, depotBoxes } = require('@structures/unbox');
const { calculateCost } = require('@functions/commands/unbox');
const command = require(`@commands/games/unbox`);

module.exports = {
  data: {
    name: 'unbox-again'
  },
  async execute (interaction) {
    if (!interaction) return;
    
    const box = interaction.message.embeds[0].author.name;
    const amount = parseInt(interaction.message.embeds[0].fields[0].value) + 1;
    let spent = parseFloat(interaction.message.embeds[0].fields[1].value.replace("$", ""));
    const showStats = false;

    if (lockboxes.includes(box)) {
      spent += 750;
    } else if (depotBoxes.includes(box)){
      spent += 3495;
    } else {
      spent = calculateCost(amount);
    }

    await command.execute(interaction, showStats, box, String(amount), String(spent));
  }
};