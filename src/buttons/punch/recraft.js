const command = require(`../../commands/games/punch`);
const choices = command.data.options[0].choices;

module.exports = {
  data: {
    name: 'recraft'
  },
  async execute (interaction) {
    if (!interaction) return;
    
    const title = interaction.message.embeds[0].title;
    const fields = interaction.message.embeds[0].fields;
    let amount = 1;

    for (const field of fields) {
      if (field.name.includes('crafted')) {
        amount = parseInt(field.value) + 1;
      }
    }

    for (const choice of choices) {
      if (title.includes(choice.value)) {
        option = choice.value;
      }
    }

    await command.execute(interaction, option, String(amount));
  }
};