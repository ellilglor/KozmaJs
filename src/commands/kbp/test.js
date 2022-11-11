const { SlashCommandBuilder, PermissionFlagsBits: perms } = require('discord.js');
const { buildEmbed } = require('@functions/general');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction) {
	  //if (interaction.channel.id === '879297439054581770') return;
    //const reply = buildEmbed(interaction).setTitle('Currently not in use.');
    const reply = buildEmbed(interaction)
      .setTitle('Trading Guidelines')
      .addFields([{ name: 'Reporting scams', value: `Take screenshots and report the player to Grey Havens!\nIf you know they're on discord, please message either The Arcade or Kozma's Backpack mods with proof.` }])
      .setFooter({ 
      text: `Information and communication is essential to negotiations. Please be careful!`, 
      iconURL: interaction.client.user.displayAvatarURL()
    });
    await interaction.deferReply({ ephemeral: true });
    
	  await interaction.editReply({ embeds: [reply] });
  }  
};
