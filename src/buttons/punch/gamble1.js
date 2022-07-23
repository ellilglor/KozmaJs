const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { rollUv } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble1'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(null).setImage(null);
    const lockButtons = ActionRowBuilder.from(interaction.message.components[0]);
    const gambleButtons = ActionRowBuilder.from(interaction.message.components[1]);
    const crafting = false;
    let index = 0, singleRolls = false;

    if (!embed.data.fields[0].name.includes('UV')) embed.data.fields.unshift({ name: '🔓 UV #1', value: '', inline: true });
    embed.data.fields[0].value = rollUv(embed.data.title, crafting, []);
    embed.data.fields = embed.data.fields.filter(f => { return (!f.name.includes('UV #2') && !f.name.includes('UV #3')) });

    for (const f in embed.data.fields) {
      switch(embed.data.fields[f].name) {
        case 'Crowns Spent':
          embed.data.fields[f].value = (parseInt(embed.data.fields[f].value.replace(/,/g, '')) + 20000).toLocaleString('en');
          index = parseInt(f) + 1;
          break;
        case 'Single Rolls':
          embed.data.fields[f].value = (parseInt(embed.data.fields[f].value.replace(/,/g, '')) + 1).toLocaleString('en');
          singleRolls = true;
      } 
    }

    if (!singleRolls) embed.data.fields.splice(index, 0, { name: 'Single Rolls', value: '1', inline: true });

    lockButtons.components[1].setDisabled(false);
    lockButtons.components[2].setDisabled(true);
    lockButtons.components[3].setDisabled(true);

    await interaction.update({ embeds: [embed], components: [lockButtons, gambleButtons] });
  }
};