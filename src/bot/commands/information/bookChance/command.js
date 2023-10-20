const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('@utils/functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bookchance')
		.setDescription('Odds of getting at least 1 Book of Dark Rituals in x kills.')
    .addIntegerOption(option =>
		  option.setName('kats')
			.setDescription('Amount of Black Kats you encountered')
      .setMinValue(1)
      .setRequired(true)),
	async execute(interaction) {
    const kats = interaction.options.getInteger('kats');
    const chance = kats < 2471 ? (1-Math.pow((1-1/250), kats)) * 100 : 99.99;

    const reply = buildEmbed(interaction)
      .setThumbnail('https://media3.spiralknights.com/wiki-images/9/91/Crafting-Book_of_Dark_Rituals.png')
      .setTitle(`After killing ${kats} Black Kats you have a ${chance.toFixed(2)}% chance of getting at least 1 Book of Dark Rituals.`)
      .setDescription('*Disclaimer: The chance to get a book stays the same for each kat, so killing 250 kats does not guarantee a drop.*')
      .addFields([
        { name: 'Black Kat spawn:', value: '1/90 or 1.11%', inline: true },
        { name: 'Book drop:', value: '1/250 or 0.4%', inline: true },
        { name: 'Overall chance per Kat:', value: '1/25000 or 0.004%', inline: true }
      ]);
    
    await interaction.editReply({ embeds: [reply] });
    await logCommand(interaction);
	}
};