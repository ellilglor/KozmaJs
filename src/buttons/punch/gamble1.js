const { rollUv } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble1'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    const buttons = interaction.message.components;

    embed.fields = embed.fields.filter(field => {
      return (!field.name.includes('UV #2') && !field.name.includes('UV #3'));
    });

    for (const button of buttons[0].components) {
      if (button.customId.includes('lock2') || button.customId.includes('lock3')) {
        button.disabled = true;
      }
    }
    const updatedButtons = [buttons[0], buttons[1]];

    await interaction.update({ embeds: [embed], components: updatedButtons });
  }
};