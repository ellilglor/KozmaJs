const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, getLanguage } = require('@functions/general');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription(`Kozma's Backpack staff only.`),
	async execute(interaction) {
	  //if (interaction.channel.id === '879297439054581770') return;
    const reply = buildEmbed().setTitle('Currently not in use.');
    await interaction.deferReply({ ephemeral: true });
    
	  await interaction.editReply({ embeds: [reply] });
  }  
};