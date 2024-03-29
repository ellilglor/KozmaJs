const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { updatePlayer, rollUv, logGambler } = require('../../functions/punch');
const dbRepo = require('@database/repos/dbRepo');
const { statTypes } = require('@database/repos/types');
const { buildEmbed } = require('@utils/functions');
const { data, prices } = require('../../data/punch');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: {
    name: 'punch-gamble1'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(null).setImage(null);
    const lockButtons = ActionRowBuilder.from(interaction.message.components[0]);
    const gambleButtons = ActionRowBuilder.from(interaction.message.components[1]);
    const item = data.get(embed.data.title), crafting = false;

    if (!embed.data.fields[0].name.includes('UV')) embed.data.fields.unshift({ name: '🔓 UV #1', value: '', inline: true });
    embed.data.fields[0].value = rollUv(item.type, crafting, []);
    embed.data.fields = embed.data.fields.filter(f => { return (!f.name.includes('UV #2') && !f.name.includes('UV #3')) });

    embed.data.fields[1].value = (parseInt(embed.data.fields[1].value.replace(/,/g, '')) + prices.single).toLocaleString('en');
    if (embed.data.fields[2]?.name === 'Single Rolls') {
      embed.data.fields[2].value = (parseInt(embed.data.fields[2].value.replace(/,/g, '')) + 1).toLocaleString('en');
    } else {
      embed.data.fields.splice(2, 0, { name: 'Single Rolls', value: '1', inline: true });
    }

    updatePlayer(interaction, item.name, embed.data.fields[0].value);
    await dbRepo.saveToDb(statTypes.gambler, interaction.user, prices.single);
    logGambler(interaction, prices.single);

    lockButtons.components[1].setDisabled(false);
    lockButtons.components[2].setDisabled(true);
    lockButtons.components[3].setDisabled(true);

    const waitEmbed = buildEmbed(interaction).setAuthor(data.get('Punch')).setImage(item.gif);
    await interaction.editReply({ embeds: [waitEmbed], components: [] });
    
    await wait(1500); await interaction.editReply({ embeds: [embed], components: [lockButtons, gambleButtons] });
  }
};