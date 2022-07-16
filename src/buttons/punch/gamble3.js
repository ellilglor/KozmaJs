const { MessageEmbed } = require('discord.js');
const { rollUv, checkForGm } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble3'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = new MessageEmbed(interaction.message.embeds[0]).setDescription('');
    const buttons = interaction.message.components;
    const uvs = [], crafting = false;
    let lock1Loc = -1, lock2Loc = -1, index = 0, tripleRolls = false;

    for (const f in embed.fields) {
      if (embed.fields[f].name.includes('🔒')) lock1Loc < 0 ? lock1Loc = f : lock2Loc = f;
    }

    if (lock1Loc > -1) {
      embed.fields[0] = { name: '🔒 UV #1', value: embed.fields[lock1Loc].value, inline: true };
      if (lock1Loc > 0) embed.fields[lock1Loc].name = embed.fields[lock1Loc].name.replace('🔒','🔓');
      
      if (lock2Loc > -1) {
        embed.fields[1] = { name: '🔒 UV #2', value: embed.fields[lock2Loc].value, inline: true };
      } else {
        const field  = { name: '🔓 UV #2', value: rollUv(embed.title, crafting, [embed.fields[0].value]), inline: true };
        embed.fields[1].name.includes('UV') ? embed.fields[1] = field : embed.fields.splice(1, 0, field);
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
    const field = { name: '🔓 UV #3', value: rollUv(embed.title, crafting, uvs), inline: true };
    embed.fields[2].name.includes('UV') ? embed.fields[2] = field : embed.fields.splice(2, 0, field);

    for (const f in embed.fields) {
      switch(embed.fields[f].name) {
        case 'Crowns Spent':
          embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 225000).toLocaleString('en');
          index = parseInt(f) + 1;
          break;
        case 'Single Rolls':
          index = parseInt(f) + 1;
          break;
        case 'Double Rolls':
          index = parseInt(f) + 1;
          break;
        case 'Triple Rolls':
          embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 1).toLocaleString('en');
          tripleRolls = true;
      }
    }

    if (!tripleRolls) embed.fields.splice(index, 0, { name: 'Triple Rolls', value: '1', inline: true });

    //checkForGm(embed)

    buttons[0].components[1].disabled = false;
    buttons[0].components[2].disabled = false;
    buttons[0].components[3].disabled = false;

    await interaction.update({ embeds: [embed], components: buttons });
  }
};