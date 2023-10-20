const { SlashCommandBuilder, PermissionFlagsBits: perms } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pricecheck')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction) {
    await interaction.channel.send({ 
      content: 'Asking for prices outside of <#1022505768869711963>?', 
      files: ['./src/bot/commands/kbp/pricecheck/data/we-dont-do-that-here.jpg'] 
    });
    
	  await interaction.editReply({ content: 'Image posted.' });
  }  
};