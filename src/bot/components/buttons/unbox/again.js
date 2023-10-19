const { boxes } = require('@structures/unbox');
const { calculateCost } = require('@functions/commands/unbox');
const command = require(`@commands/games/unbox`);

module.exports = {
  data: {
    name: 'unbox-again'
  },
  async execute (interaction) {
    if (!interaction) return;

    const showStats = false;
    const box = interaction.message.embeds[0].author.name;
    const amount = parseInt(interaction.message.embeds[0].fields[0].value) + 1;
    
    const boxData = boxes.get(box);
    const spent = boxData.currency === '$' ? calculateCost(amount) : amount * boxData.price;

    await command.execute(interaction, 'defer', showStats, box, amount, spent);
  }
};