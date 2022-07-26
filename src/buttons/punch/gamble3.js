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
    let lock1Loc = -1, lock2Loc = -1, index = 4, tripleRolls = false;

    embed.data.fields.every((f, ind) => {
      if (f.name.includes('🔒')) lock1Loc < 0 ? lock1Loc = ind : lock2Loc = ind;
      return lock2Loc < 0 ? true : false;
    });

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

    embed.data.fields[3].value = (parseInt(embed.data.fields[3].value.replace(/,/g, '')) + 225000).toLocaleString('en');
    embed.data.fields.forEach(f => {
      switch(f.name) {
        case 'Single Rolls': index += 1; break;
        case 'Double Rolls': index += 1; break;
        case 'Triple Rolls': f.value = (parseInt(f.value.replace(/,/g, '')) + 1).toLocaleString('en'); tripleRolls = true;
      } 
    });
    if (!tripleRolls) embed.data.fields.splice(index, 0, { name: 'Triple Rolls', value: '1', inline: true });

    embed = checkForGm(embed);

    lockButtons.components[1].setDisabled(false);
    lockButtons.components[2].setDisabled(false);
    lockButtons.components[3].setDisabled(false);

    await interaction.update({ embeds: [embed], components: [lockButtons, gambleButtons] });
  }
};