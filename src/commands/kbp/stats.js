const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits: perms } = require('discord.js');
const { buildStats } = require('@functions/commands/stats');

const embeds = [], pages = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction, button) {
    const id = interaction.user.id;
    pages[id] = pages[id] || 0;

    if (button && embeds.length === 0) {
      return await interaction.update({ content: 'The bot has restarted.', embeds: [], components: [], ephemeral: true });
    }

    switch (button) {
      case 'first': pages[id] = 0; break;
      case 'previous': --pages[id]; break;
      case 'next': ++pages[id]; break;
      case 'last': pages[id] = embeds.length - 1; break;
      default: 
        const defer = await interaction.deferReply({ ephemeral: true, fetchReply: true });
        embeds.splice(0, embeds.length);
        await buildStats(interaction, embeds, defer);
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
    
    const message = { embeds: [embeds[pages[id]]], components: [buttons] };
    button ? await interaction.update(message) : await interaction.editReply(message);
  }
};