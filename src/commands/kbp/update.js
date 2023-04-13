const { SlashCommandBuilder, PermissionFlagsBits: perms } = require('discord.js');
const { buildEmbed, logCommand } = require('@functions/general');
const { convertLogs, updateRate } = require('@functions/commands/update');
const { channels } = require('@structures/findlogs');
const { globals } = require('@data/variables');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction) {
    const startTime = performance.now();
    const reply = buildEmbed(interaction).setTitle('Executing /update');
    const stats = [], collectAll = true;
    const logChannel = interaction.client.channels.cache.get(globals.botLogsChannelId);
    const channel = interaction.client.channels.cache.get(globals.marketChannelId);
    const message = await channel.messages.fetch({ limit: 1 });
    const msg = message.first();
    let totalTime = 0;

    await interaction.editReply({ embeds: [reply] });

    //await updateRate(msg, logChannel);
    
    // const marketTime = ((performance.now() - startTime)/1000).toFixed(2);
    // totalTime += parseFloat(marketTime);
    // await interaction.editReply({ embeds: [reply.setTitle(`Finished reading market image in ${marketTime} seconds`)] });

    for (const [name, id] of channels) {
      const start = performance.now();
      const chnl = interaction.guild.channels.cache.get(id);
      
      stats.push(await convertLogs(chnl, name, collectAll));
      
      const time = ((performance.now() - start)/1000).toFixed(2);
      totalTime += parseFloat(time);

      await interaction.editReply({ embeds: [reply.setTitle(`Finished ${name} in ${time} seconds`)] });
    }
    
    console.table(stats);
    await interaction.editReply({ embeds: [reply.setTitle(`Update completed in ${(totalTime/60).toFixed(2)} minutes!`)] });
	}
};