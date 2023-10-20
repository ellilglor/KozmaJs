const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits: perms } = require('discord.js');
const { buildStats } = require('./functions/stats');

const embeds = [], pages = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction, defer, button) {
    const id = interaction.user.id;
    pages[id] ||= 0;

    if (button && embeds.length === 0) {
      return await interaction.editReply({ content: 'The bot has restarted.', embeds: [], components: [], ephemeral: true });
    }

    switch (button) {
      case 'first': pages[id] = 0; break;
      case 'previous': --pages[id]; break;
      case 'next': ++pages[id]; break;
      case 'last': pages[id] = embeds.length - 1; break;
      default: 
        embeds.splice(0, embeds.length);
        
        const start = performance.now();
        await buildStats(interaction, embeds, defer);
        console.log(`Finished building embeds in ${((performance.now() - start)/1000).toFixed(2)} seconds`);
    }

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
				.setCustomId('first-stats').setLabel('◀◀').setStyle('Primary')
        .setDisabled(pages[id] === 0),
			new ButtonBuilder()
				.setCustomId('prev-stats').setLabel('◀').setStyle('Primary')
        .setDisabled(pages[id] === 0),
      new ButtonBuilder()
				.setCustomId('next-stats').setLabel('▶').setStyle('Primary')
        .setDisabled(pages[id] === embeds.length - 1),
      new ButtonBuilder()
				.setCustomId('last-stats').setLabel('▶▶').setStyle('Primary')
        .setDisabled(pages[id] === embeds.length - 1)
		);
    
    await interaction.editReply({ embeds: [embeds[pages[id]]], components: [buttons] });
  }
};