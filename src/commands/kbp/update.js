const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed, logCommand } = require('../../functions/general');
const { convertLogs, saveStats, getBotLogs } = require('../../functions/commands/update');
const { channels } = require('../../data/structures/findlogs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultPermission(false),
	async execute(interaction) {
    const reply = buildEmbed().setTitle('Executing /update');
    const stats = [];
    await logCommand(interaction);
    await interaction.reply({embeds: [reply], ephemeral: true});

    for (const channel of channels) {
      stats.push(await convertLogs(interaction, channel[0], channel[1]));
      reply.setTitle(`Finished ${channel[0]}`);
      await interaction.editReply({embeds: [reply]});
    }
    
    saveStats(stats);
    
    reply.setTitle(`Saving bot-logs`);
    await interaction.editReply({embeds: [reply]});
    await getBotLogs(interaction);

    reply.setTitle('Update completed!');
    await interaction.editReply({embeds: [reply]});

    console.log('Update Completed!')
	}
};