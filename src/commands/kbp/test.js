const { SlashCommandBuilder, PermissionFlagsBits: perms } = require('discord.js');
const { buildEmbed } = require('@functions/general');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction) {
	  //if (interaction.channel.id === '879297439054581770') return;
    const reply = buildEmbed(interaction).setTitle('Currently not in use.');
    await interaction.deferReply({ ephemeral: true });
    
	  await interaction.editReply({ embeds: [reply] });
  }  
};
