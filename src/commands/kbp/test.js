const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed } = require('@functions/general');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultPermission(false),
	async execute(interaction) {
	  //if (interaction.channel.id === '879297439054581770') return;
    const reply = buildEmbed().setTitle('Currently not in use.');
    await interaction.deferReply({ ephemeral: true });
    let kats = 1;
    let chance = (1-Math.pow((1-1/250), kats)) * 100;

    while (chance < 99.995) {
      kats += 1;
      chance = (1-Math.pow((1-1/250), kats)) * 100;
    }
    console.log(kats)
    
	  await interaction.editReply({ embeds: [reply] });
  }  
};