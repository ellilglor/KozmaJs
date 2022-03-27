const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { logCommand } = require('../../functions/general');
const { buildStats } = require('../../functions/commands/stats');

const embeds = [];
const pages = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultPermission(false),
	async execute(interaction, button) {
    const id = interaction.user.id;
    pages[id] = pages[id] || 0;

    if (button) {
      button.includes('nextStat') ? ++pages[id] : --pages[id];
    } else {
      embeds.splice(0, embeds.length);
      buildStats(embeds, interaction);
    }

    const buttons = new MessageActionRow()
		  .addComponents(
			  new MessageButton()
				.setCustomId('prev-stats')
				.setLabel('◀')
				.setStyle('PRIMARY')
        .setDisabled(pages[id] === 0),
        new MessageButton()
				.setCustomId('next-stats')
				.setLabel('▶')
				.setStyle('PRIMARY')
        .setDisabled(pages[id] === embeds.length - 1),
		);
    
    const embed = embeds[pages[id]];
    
    if (button) {
      await interaction.update({embeds: [embed], components: [buttons]});
    } else {
      await interaction.reply({embeds: [embed], components: [buttons], ephemeral: true});
      await logCommand(interaction);
    }
	}
};