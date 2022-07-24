const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { rollUv, checkForGm } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble3'
  },
  async execute (interaction) {
    if (!interaction) return;

    let embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(null);
    const lockButtons = ActionRowBuilder.from(interaction.message.components[0]);
    const gambleButtons = ActionRowBuilder.from(interaction.message.components[1]);
    const uvs = [], crafting = false, item = embed.data.title;
    let lock1Loc = -1, lock2Loc = -1, index = 0, tripleRolls = false;

    for (const f in embed.data.fields) {
      if (embed.data.fields[f].name.includes('🔒')) lock1Loc < 0 ? lock1Loc = f : lock2Loc = f;
    }

    if (lock1Loc > -1) {
      embed.data.fields[0] = { name: '🔒 UV #1', value: embed.data.fields[lock1Loc].value, inline: true };
      if (lock1Loc > 0) embed.data.fields[lock1Loc].name = embed.data.fields[lock1Loc].name.replace('🔒','🔓');
      
      if (lock2Loc > -1) {
        embed.data.fields[1] = { name: '🔒 UV #2', value: embed.data.fields[lock2Loc].value, inline: true };
      } else {
        const field  = { name: '🔓 UV #2', value: rollUv(item, crafting, [embed.data.fields[0].value]), inline: true };
        embed.data.fields[1].name.includes('UV') ? embed.data.fields[1] = field : embed.data.fields.splice(1, 0, field);
      }
    } else {
      if (!embed.data.fields[0].name.includes('UV')) {
        embed.data.fields.unshift({ name: '🔓 UV #2', value: rollUv(item, crafting, []), inline: true });
        embed.data.fields.unshift({ name: '🔓 UV #1', value: rollUv(item, crafting, [embed.data.fields[0].value]), inline: true });
      } else if (!embed.data.fields[1].name.includes('UV')) {
        embed.data.fields[0].value = rollUv(item, crafting, []);
        embed.data.fields.splice(1, 0, { name: '🔓 UV #2', value: rollUv(item, crafting, [embed.data.fields[0].value]), inline: true });
      } else {
        embed.data.fields[0].value = rollUv(item, crafting, []);
        embed.data.fields[1].value = rollUv(item, crafting, [embed.data.fields[0].value]);
      }
    }

    uvs.push(embed.data.fields[0].value, embed.data.fields[1].value);
    const field = { name: '🔓 UV #3', value: rollUv(item, crafting, uvs), inline: true };
    embed.data.fields[2].name.includes('UV') ? embed.data.fields[2] = field : embed.data.fields.splice(2, 0, field);

    for (const f in embed.data.fields) {
      switch(embed.data.fields[f].name) {
        case 'Crowns Spent':
          embed.data.fields[f].value = (parseInt(embed.data.fields[f].value.replace(/,/g, '')) + 225000).toLocaleString('en');
          index = parseInt(f) + 1;
          break;
        case 'Single Rolls':
          index = parseInt(f) + 1;
          break;
        case 'Double Rolls':
          index = parseInt(f) + 1;
          break;
        case 'Triple Rolls':
          embed.data.fields[f].value = (parseInt(embed.data.fields[f].value.replace(/,/g, '')) + 1).toLocaleString('en');
          tripleRolls = true;
      }
    }

    if (!tripleRolls) embed.data.fields.splice(index, 0, { name: 'Triple Rolls', value: '1', inline: true });

    embed = checkForGm(embed);

    lockButtons.components[1].setDisabled(false);
    lockButtons.components[2].setDisabled(false);
    lockButtons.components[3].setDisabled(false);

    await interaction.update({ embeds: [embed], components: [lockButtons, gambleButtons] });
  }
};