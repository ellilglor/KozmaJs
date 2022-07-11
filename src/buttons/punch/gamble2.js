const { rollUv } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble2'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    const buttons = interaction.message.components;
    const uvs = [], crafting = false;
    let lockLocation = -1, doubleRolls = false;

    for (const f in embed.fields) {
      if (embed.fields[f].name.includes('🔒')) {
        lockLocation = f;
        break;
      }
    }

    if (lockLocation > -1) {
      embed.fields[0].name = '🔒 UV #1';
      embed.fields[0].value = embed.fields[lockLocation].value;
      embed.fields[1].name = '🔓 UV #2';
      embed.fields[1].inline = true;
    } else {
      embed.fields[0].value = rollUv(embed.title, crafting, uvs);
    }

    uvs.push(embed.fields[0].value);
    embed.fields[1].value = rollUv(embed.title, crafting, uvs);
    buttons[0].components[3].disabled = true;

    embed.fields = embed.fields.filter(field => {
      return (!field.name.includes('UV #3'));
    });

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

    await interaction.update({ embeds: [embed], components: buttons });
  }
};