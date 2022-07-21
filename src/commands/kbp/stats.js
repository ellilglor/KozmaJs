const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { buildStats } = require('../../functions/commands/stats');

const embeds = [], pages = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultPermission(false),
	async execute(interaction, button) {
    const id = interaction.user.id;
    pages[id] = pages[id] || 0;

    if (button) {
      if (embeds.length === 0) await buildStats(embeds, interaction);
      button.includes('next') ? ++pages[id] : --pages[id];
    } else {
      await interaction.deferReply({ ephemeral: true });
      embeds.splice(0, embeds.length);
      await buildStats(embeds, interaction);
    }

    const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('prev-stats').setLabel('◀').setStyle('Primary')
        .setDisabled(pages[id] === 0),
      new ButtonBuilder()
				.setCustomId('next-stats').setLabel('▶').setStyle('Primary')
        .setDisabled(pages[id] === embeds.length - 1),
		);
    
    const embed = embeds[pages[id]];
    const message = { embeds: [embed], components: [buttons] };
    button ? await interaction.update(message) : await interaction.editReply(message);
  }
};