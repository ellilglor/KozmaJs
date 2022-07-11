const { rollUv } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble3'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    const buttons = interaction.message.components;
    const uvs = [], crafting = false;
    let lock1Location = -1, lock2Location = -1, index = 0, tripleRolls = false;

    for (const f in embed.fields) {
      if (embed.fields[f].name.includes('🔒')) {
        lock1Location < 0 ? lock1Location = f : lock2Location = f;
      }
    }

    if (lock1Location > -1) {
      embed.fields[0].name = '🔒 UV #1';
      embed.fields[0].value = embed.fields[lock1Location].value;
      if (lock2Location > -1) {
        embed.fields[1].name = '🔒 UV #2';
        embed.fields[1].value = embed.fields[lock2Location].value;
      }
    } else {
      if (!embed.fields[0].name.includes('UV')) {
        embed.fields.unshift({ name: '🔓 UV #2', value: rollUv(embed.title, crafting, []), inline: true });
        embed.fields.unshift({ name: '🔓 UV #1', value: rollUv(embed.title, crafting, [embed.fields[0].value]), inline: true });
      } else if (!embed.fields[1].name.includes('UV')) {
        embed.fields.splice(1, 0, { name: '🔓 UV #2', value: rollUv(embed.title, crafting, [embed.fields[0].value]), inline: true });
      } else {
        embed.fields[0].value = rollUv(embed.title, crafting, []);
        embed.fields[1].value = rollUv(embed.title, crafting, [embed.fields[0].value]);
      }
    }

    uvs.push(embed.fields[0].value, embed.fields[1].value);
    const uv = rollUv(embed.title, crafting, uvs);

    if (!embed.fields[2].name.includes('UV')) {
      embed.fields.splice(2, 0, { name: '🔓 UV #3', value: uv, inline: true });
    } else {
      embed.fields[2] = { name: '🔓 UV #3', value: uv, inline: true };
    }

    for (const f in embed.fields) {
      if (embed.fields[f].name.includes('Crowns')) {
        embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 225000).toLocaleString('en');
        index = parseInt(f) + 1;
      } else if (embed.fields[f].name.includes('Single')) {
        index = parseInt(f) + 1;
      } else if (embed.fields[f].name.includes('Double')) {
        index = parseInt(f) + 1;
      } else if (embed.fields[f].name.includes('Triple')) {
        embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 1).toLocaleString('en');
        tripleRolls = true;
      }
    }

    if (!tripleRolls) {
      embed.fields.splice(index, 0, { name: 'Triple Rolls:', value: '1', inline: true });
    }

    buttons[0].components[1].disabled = false;
    buttons[0].components[2].disabled = false;
    buttons[0].components[3].disabled = false;

    await interaction.update({ embeds: [embed], components: buttons });
  }
};