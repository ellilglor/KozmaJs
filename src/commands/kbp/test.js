const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed } = require('../../functions/general');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultPermission(false),
	async execute(interaction) {
	  //if (interaction.channel.id === '879297439054581770') { return }
    const reply = buildEmbed().setTitle('Currently not in use.');
    await interaction.deferReply({ephemeral: true});
    const channel = interaction.client.channels.cache.get('879297439054581770');

    let squares = '';

    while (squares.length < 4096) {
      squares += '⬜';
    }

    const embed = buildEmbed().setDescription(squares);
    
    await channel.send({ embeds: [embed] });
	  await interaction.editReply({embeds: [reply]});
  }  
};