const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { updatePlayer, rollUv, checkForGm, logGambler } = require('@functions/commands/punch');
const { saveGambler } = require('@functions/database/saveStats');
const { buildEmbed } = require('@functions/general');
const { images } = require('@structures/punch');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: {
    name: 'punch-gamble2'
  },
  async execute (interaction) {
    if (!interaction) return;

    let embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(null);
    const lockButtons = ActionRowBuilder.from(interaction.message.components[0]);
    const gambleButtons = ActionRowBuilder.from(interaction.message.components[1]);
    const uvs = [], crafting = false, item = embed.data.title, ticket = 75000;
    let lockLoc = -1, index = 3, doubleRolls = false;

    embed.data.fields.every((f, ind) => {
      if (f.name.includes('🔒')) lockLoc = ind;
      return lockLoc < 0 ? true : false;
    });

    if (lockLoc > -1) {
      embed.data.fields[0] = { name: '🔒 UV #1', value: embed.data.fields[lockLoc].value, inline: true };
    } else {
      if (!embed.data.fields[0].name.includes('UV')) embed.data.fields.unshift({ name: '🔓 UV #1', value: '', inline: true });
      embed.data.fields[0].value = rollUv(item, crafting, []);
    }

    uvs.push(embed.data.fields[0].value);
    const field = { name: '🔓 UV #2', value: rollUv(item, crafting, uvs), inline: true };
    embed.data.fields[1].name.includes('UV') ? embed.data.fields[1] = field : embed.data.fields.splice(1, 0, field);
    embed.data.fields = embed.data.fields.filter(f => { return !f.name.includes('UV #3') });

    embed.data.fields[2].value = (parseInt(embed.data.fields[2].value.replace(/,/g, '')) + ticket).toLocaleString('en');
    embed.data.fields.forEach(f => {
      if (f.name.includes('🔓')) updatePlayer(interaction, embed.data.title, f.value);
      
      switch (f.name) {
        case 'Single Rolls': index += 1; break;
        case 'Double Rolls': f.value = (parseInt(f.value.replace(/,/g, '')) + 1).toLocaleString('en'); doubleRolls = true;
      } 
    });
    if (!doubleRolls) embed.data.fields.splice(index, 0, { name: 'Double Rolls', value: '1', inline: true });

    embed = checkForGm(embed, interaction);
    await saveGambler(interaction.user, ticket);
    logGambler(interaction, ticket);

    lockButtons.components[1].setDisabled(false);
    lockButtons.components[2].setDisabled(false);
    lockButtons.components[3].setDisabled(true);

    const waitEmbed = buildEmbed(interaction).setAuthor(images.get('Punch')).setImage(images.get(embed.data.title).gif);
    await interaction.update({ embeds: [waitEmbed], components: [] });

    await wait(1500); await interaction.editReply({ embeds: [embed], components: [lockButtons, gambleButtons] });
  }
};