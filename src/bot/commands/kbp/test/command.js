const { SlashCommandBuilder, PermissionFlagsBits: perms } = require('discord.js');
const { buildEmbed } = require('@utils/functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction) {
    const reply = buildEmbed(interaction).setTitle('Command used for testing.');
    
	  await interaction.editReply({ embeds: [reply] });
  }  
};