const command = require(`@commands/games/punch`);
const { getLanguage } = require('@functions/general');

module.exports = {
  data: {
    name: 'recraft'
  },
  async execute (interaction) {
    if (!interaction) return;

    const lan = getLanguage(interaction.locale).punch;
    const item = interaction.message.embeds[0].title.replace(`${lan.title2}: `, '');
    const field = interaction.message.embeds[0].fields.find(f => f.name === lan.crafted);
    const amount = String(parseInt(field.value) + 1);

    await command.execute(interaction, item, amount);
  }
};