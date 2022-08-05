const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { rollUv } = require('@functions/commands/punch');
const { getLanguage } = require('@functions/general');

module.exports = {
  data: {
    name: 'punch-gamble1'
  },
  async execute (interaction) {
    if (!interaction) return;

    const lan = getLanguage(interaction.locale).punch;
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(null).setImage(null);
    const lockButtons = ActionRowBuilder.from(interaction.message.components[0]);
    const gambleButtons = ActionRowBuilder.from(interaction.message.components[1]);
    const crafting = false;

    if (!embed.data.fields[0].name.includes('UV')) embed.data.fields.unshift({ name: '🔓 UV #1', value: '', inline: true });
    embed.data.fields[0].value = rollUv(embed.data.title, crafting, []);
    embed.data.fields = embed.data.fields.filter(f => { return (!f.name.includes('UV #2') && !f.name.includes('UV #3')) });

    embed.data.fields[1].value = (parseInt(embed.data.fields[1].value.replace(/,/g, '')) + 20000).toLocaleString('en');
    if (embed.data.fields[2]?.name === lan.single) {
      embed.data.fields[2].value = (parseInt(embed.data.fields[2].value.replace(/,/g, '')) + 1).toLocaleString('en');
    } else {
      embed.data.fields.splice(2, 0, { name: lan.single, value: '1', inline: true });
    }

    lockButtons.components[1].setDisabled(false);
    lockButtons.components[2].setDisabled(true);
    lockButtons.components[3].setDisabled(true);

    await interaction.update({ embeds: [embed], components: [lockButtons, gambleButtons] });
  }
};