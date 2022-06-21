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
    const chance = (1-Math.pow((1-1/250), kats)) * 100;

    const reply = buildEmbed()
      .setTitle(`After killing ${kats} black kats you have a ${chance.toFixed(2)}% chance of getting at least 1 Book of Dark Rituals.`);
    
    await interaction.reply({embeds: [reply], ephemeral: true});
    await logCommand(interaction);
	}
};