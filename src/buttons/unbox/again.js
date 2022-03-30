const { lockboxes, depotBoxes } = require('../../data/structures/unbox')
const command = require(`../../commands/games/unbox`);

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
      let cost = 0;

      const amount14Batches = Math.floor(amount / 14);
      cost += amount14Batches * 49.95;

      const amount5Batches = Math.floor((amount - 14 * amount14Batches) / 5);
      cost += amount5Batches * 19.95;

      const extra = Math.floor(amount - 14 * amount14Batches - 5 * amount5Batches);
      cost += extra * 4.95;

      spent = cost.toFixed(2);
    }

    await command.execute(interaction, showStats, box, String(amount), String(spent));
  }
};