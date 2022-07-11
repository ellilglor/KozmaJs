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
    let lockLocation = -1, index = 0, doubleRolls = false;

    for (const f in embed.fields) {
      if (embed.fields[f].name.includes('🔒')) {
        lockLocation = f;
        break;
      }
    }

    if (lockLocation > -1) {
      embed.fields[0].name = '🔒 UV #1';
      embed.fields[0].value = embed.fields[lockLocation].value;
    } else {
      if (!embed.fields[0].name.includes('UV')) {
        embed.fields.unshift({ name: '🔓 UV #1', value: rollUv(embed.title, crafting, uvs), inline: true });
      }
    }

    uvs.push(embed.fields[0].value);
    const uv = rollUv(embed.title, crafting, uvs);

    if (!embed.fields[1].name.includes('UV')) {
      embed.fields.splice(1, 0, { name: '🔓 UV #2', value: uv, inline: true });
    } else {
      embed.fields[1] = { name: '🔓 UV #2', value: uv, inline: true };
    }

    embed.fields = embed.fields.filter(field => {
      return (!field.name.includes('UV #3'));
    });

    for (const f in embed.fields) {
      if (embed.fields[f].name.includes('Crowns')) {
        embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 75000).toLocaleString('en');
        index = parseInt(f) + 1;
      } else if (embed.fields[f].name.includes('Single')) {
        index = parseInt(f) + 1;
      } else if (embed.fields[f].name.includes('Double')) {
        embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 1).toLocaleString('en');
        doubleRolls = true;
        break;
      }
    }

    if (!doubleRolls) {
      embed.fields.splice(index, 0, { name: 'Double Rolls:', value: '1', inline: true });
    }

    buttons[0].components[1].disabled = false;
    buttons[0].components[2].disabled = false;
    buttons[0].components[3].disabled = true;

    await interaction.update({ embeds: [embed], components: buttons });
  }
};