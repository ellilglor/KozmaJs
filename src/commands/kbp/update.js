const { SlashCommandBuilder } = require('@discordjs/builders');
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
    const stats = [];
    await interaction.reply({embeds: [reply], ephemeral: true});

    for (const channel of channels) {
      const chnl = interaction.guild.channels.cache.get(channel[1]);
      stats.push(await convertLogs(chnl, channel[0], true));
      reply.setTitle(`Finished ${channel[0]}`);
      await interaction.editReply({embeds: [reply]});
    }
    
    saveStats(stats);

    reply.setTitle('Update completed!');
    await interaction.editReply({embeds: [reply]});
    console.log('Update Completed!');
	}
};