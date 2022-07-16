const { MessageEmbed } = require('discord.js');
const { rollUv, checkForGm } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble2'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = new MessageEmbed(interaction.message.embeds[0]).setDescription('');
    const buttons = interaction.message.components;
    const uvs = [], crafting = false;
    let lockLoc = -1, index = 0, doubleRolls = false;

    for (const f in embed.fields) {
      if (embed.fields[f].name.includes('🔒')) {
        lockLoc = f;
        break;
      }
    }

    if (lockLoc > -1) {
      embed.fields[0] = { name: '🔒 UV #1', value: embed.fields[lockLoc].value, inline: true };
    } else {
      if (!embed.fields[0].name.includes('UV')) embed.fields.unshift({ name: '🔓 UV #1', value: '', inline: true });
      embed.fields[0].value = rollUv(embed.title, crafting, []);
    }

    uvs.push(embed.fields[0].value);
    const field = { name: '🔓 UV #2', value: rollUv(embed.title, crafting, uvs), inline: true };
    embed.fields[1].name.includes('UV') ? embed.fields[1] = field : embed.fields.splice(1, 0, field);
    embed.fields = embed.fields.filter(f => { return !f.name.includes('UV #3') });

    for (const f in embed.fields) {
      switch(embed.fields[f].name) {
        case 'Crowns Spent':
          embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 75000).toLocaleString('en');
          index = parseInt(f) + 1;
          break;
        case 'Single Rolls':
          index = parseInt(f) + 1;
          break;
        case 'Double Rolls':
          embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 1).toLocaleString('en');
          doubleRolls = true;
      }
    }

    if (!doubleRolls) embed.fields.splice(index, 0, { name: 'Double Rolls', value: '1', inline: true });

    //checkForGm(embed)

    buttons[0].components[1].disabled = false;
    buttons[0].components[2].disabled = false;
    buttons[0].components[3].disabled = true;

    await interaction.update({ embeds: [embed], components: buttons });
  }
};