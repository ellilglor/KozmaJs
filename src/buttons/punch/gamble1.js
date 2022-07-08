const { rollUv } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble1'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    const buttons = interaction.message.components;
    const crafting = false;
    let reroll = false; 

    if (embed.fields[0].name.includes('🔒') || embed.fields[1]?.name.includes('🔒') || embed.fields[2]?.name.includes('🔒')) {
      embed.description = `❗*You can't reroll a locked UV*❗`;
    } else {
      embed.description = ``;
      reroll = true;
    }

    if (reroll) {
      embed.fields = embed.fields.filter(field => {
        return (!field.name.includes('UV #2') && !field.name.includes('UV #3'));
      });

      embed.fields[0].value = rollUv(embed.title, crafting, []);

      let singleRolls = false, crownsIndex = 0;

      for (const f in embed.fields) {
        if (embed.fields[f].name.includes('Crowns')) {
          embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 20000).toLocaleString('en');
          crownsIndex = f;
        } else if (embed.fields[f].name.includes('Single')) {
          embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 1).toLocaleString('en');
          singleRolls = true;
        }
      }

      if (!singleRolls) {
        const tempArray = embed.fields.splice(parseInt(crownsIndex) + 1, 69);
        embed.addField('Single Rolls:', '1', true);
        embed.fields.push(tempArray);
      }

      for (const button of buttons[0].components) {
        if (button.customId.includes('lock2') || button.customId.includes('lock3')) {
          button.disabled = true;
        }
      }
    }
    
    const updatedButtons = [buttons[0], buttons[1]];

    await interaction.update({ embeds: [embed], components: updatedButtons });
  }
};