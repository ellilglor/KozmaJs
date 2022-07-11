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
    let singleRolls = false, crownsIndex = 0;

    if (!embed.fields[0].name.includes('UV')) {
      embed.fields.unshift({ name: '🔓 UV #1', value: '', inline: true });
    }
    
    embed.fields[0].value = rollUv(embed.title, crafting, []);
    buttons[0].components[2].disabled = true;
    buttons[0].components[3].disabled = true;

    embed.fields = embed.fields.filter(field => {
      return (!field.name.includes('UV #2') && !field.name.includes('UV #3'));
    });

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

    await interaction.update({ embeds: [embed], components: buttons });
  }
};