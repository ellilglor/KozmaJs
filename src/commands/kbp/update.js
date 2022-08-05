const { SlashCommandBuilder, PermissionFlagsBits: perms } = require('discord.js');
const { buildEmbed, logCommand } = require('@functions/general');
const { convertLogs, saveStats } = require('@functions/commands/update');
const { channels } = require('@structures/findlogs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction) {
    const reply = buildEmbed(interaction).setTitle('Executing /update');
    const stats = [], collectAll = true;
    
    await interaction.reply({ embeds: [reply], ephemeral: true });

    for (const [name, id] of channels) {
      const chnl = interaction.guild.channels.cache.get(id);
      stats.push(await convertLogs(chnl, name, collectAll));
      await interaction.editReply({ embeds: [reply.setTitle(`Finished ${name}`)] });
    }
    
    saveStats(stats);

    await interaction.editReply({ embeds: [reply.setTitle('Update completed!')] });
    console.log('Update Completed!');
	}
};