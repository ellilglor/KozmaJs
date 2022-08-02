const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand, getLanguage } = require('@functions/general');

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
    const lan = getLanguage('temp').bookChance;
    const kats = interaction.options.getInteger('kats');
    const chance = kats < 2471 ? (1-Math.pow((1-1/250), kats)) * 100 : 99.99;

    const reply = buildEmbed(interaction)
      .setThumbnail('https://media3.spiralknights.com/wiki-images/9/91/Crafting-Book_of_Dark_Rituals.png')
      .setTitle(`${lan.title1} ${kats} ${lan.title2} ${chance.toFixed(2)}% ${lan.title3}`)
      .setDescription(lan.desc)
      .addFields([
        { name: lan.spawn, value: `1/90 ${lan.or} 1.11%`, inline: true },
        { name: lan.drop, value: `1/250 ${lan.or} 0.4%`, inline: true },
        { name: lan.chance, value: '0.004%', inline: true }
      ]);
    
    await interaction.reply({ embeds: [reply], ephemeral: true });
    await logCommand(interaction);
	}
};