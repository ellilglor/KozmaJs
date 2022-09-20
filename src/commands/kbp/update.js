const { SlashCommandBuilder, PermissionFlagsBits: perms } = require('discord.js');
const { buildEmbed, logCommand } = require('@functions/general');
const { convertLogs, saveStats, updateRate } = require('@functions/commands/update');
const { channels } = require('@structures/findlogs');
const { globals } = require('@data/variables');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction) {
    const reply = buildEmbed(interaction).setTitle('Executing /update');
    const stats = [], collectAll = true;
    const logChannel = interaction.client.channels.cache.get(globals.botLogsChannelId);
    const channel = interaction.client.channels.cache.get(globals.marketChannelId);
    const message = await channel.messages.fetch({ limit: 1 });
    const msg = message.first();

    await interaction.reply({ embeds: [reply], ephemeral: true });

    await updateRate(msg, logChannel);
    await interaction.editReply({ embeds: [reply.setTitle('Finished reading market image')] });

    for (const [name, id] of channels) {
      const chnl = interaction.guild.channels.cache.get(id);
      stats.push(await convertLogs(chnl, name, collectAll));
      await interaction.editReply({ embeds: [reply.setTitle(`Finished ${name}`)] });
    }
    
    saveStats(stats);

    console.table(stats);
    await interaction.editReply({ embeds: [reply.setTitle('Update completed!')] });
	}
};