const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('../../functions/general');
const { convertLogs, saveStats } = require('../../functions/commands/update');
const { channels } = require('../../data/structures/findlogs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultPermission(false),
	async execute(interaction) {
    const reply = buildEmbed().setTitle('Executing /update');
    const stats = [], collectAll = true;
    await interaction.reply({ embeds: [reply], ephemeral: true });

    for (const channel of channels) {
      const chnl = interaction.guild.channels.cache.get(channel[1]);
      stats.push(await convertLogs(chnl, channel[0], collectAll));
      reply.setTitle(`Finished ${channel[0]}`);
      await interaction.editReply({ embeds: [reply] });
    }
    
    saveStats(stats);

    await interaction.editReply({ embeds: [reply.setTitle('Update completed!')] });
    console.log('Update Completed!');
	}
};