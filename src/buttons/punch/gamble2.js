const { rollUv } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble2'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    const buttons = interaction.message.components;
    const uvs = [];
    const crafting = false;
    let reroll = false, lockCount = 0;

    for (const field of embed.fields) {
      if (field.name.includes('🔒')) lockCount += 1;
    }

    if (lockCount > 2) {
      embed.description = `❗*You can only lock 1 UV*❗`;
    } else {
      embed.description = ``;
      reroll = true;
    }


    if (reroll) {
      embed.fields = embed.fields.filter(field => {
        return (!field.name.includes('UV #3'));
      });

      //embed.fields[0].value = rollUv(embed.title, crafting, []);

      let doubleRolls = false;

      for (const field of embed.fields) {
        if (field.name.includes('Crowns')) {
          field.value = (parseInt(field.value.replace(/,/g, '')) + 75000).toLocaleString('en');
        } else if (field.name.includes('Double')) {
          field.value = (parseInt(field.value.replace(/,/g, '')) + 1).toLocaleString('en');
          doubleRolls = true;
        }
      }

      if (!doubleRolls) {
        embed.addField('Double Rolls:', '1', true);
      }

      for (const button of buttons[0].components) {
        if (button.customId.includes('lock3')) {
          button.disabled = true;
        }
      }
    }
    
    const updatedButtons = [buttons[0], buttons[1]];

    await interaction.update({ embeds: [embed], components: updatedButtons });
  }
};