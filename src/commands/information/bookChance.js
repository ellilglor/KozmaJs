const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed, logCommand } = require('../../functions/general');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bookchance')
		.setDescription('Odds of getting at least 1 book in x kills.')
    .addIntegerOption(option =>
		  option.setName('kats')
			.setDescription('Amount of Black Kats you encountered')
      .setMinValue(1)
      .setRequired(true)),
	async execute(interaction) {
    const kats = interaction.options.getInteger('kats');
    let chance = (1-Math.pow((1-1/250), kats)) * 100;
    if (chance > 99.99) chance = 99.99;

    const reply = buildEmbed()
      .setThumbnail('https://media3.spiralknights.com/wiki-images/9/91/Crafting-Book_of_Dark_Rituals.png')
      .setTitle(`After killing ${kats} Black Kats you have a ${chance.toFixed(2)}% chance of getting at least 1 Book of Dark Rituals.`)
      .setDescription('*Disclaimer: The chance to get a book stays the same for each kat, so killing 250 kats does not guarantee a drop.*')
      .addField('Black Kat spawn:', `1/90 or 1.11%`, true)
      .addField('Book drop:', '1/250 or 0.4%', true)
      .addField('Overal chance per Kat:', '0.004%', true);
    
    await interaction.reply({ embeds: [reply], ephemeral: true });
    await logCommand(interaction);
	}
};