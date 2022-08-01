const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand, getLanguage } = require('@functions/general');
const { searchLogs } = require('@functions/commands/findlogs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('findlogs')
		.setDescription('Search the tradelog database for an item.')
    .addStringOption(option =>
		  option.setName('item')
			.setDescription('Item the bot should look for.')
			.setRequired(true)
      .setMinLength(3)
      .setMaxLength(69))
    .addIntegerOption(option =>
		  option.setName('months')
			.setDescription('How far back the bot should search. Default: 6 months.')
      .setMinValue(1)
      .setMaxValue(24))
    .addStringOption(option =>
		  option.setName('variants')
			.setDescription('Check for color variants / item family tree. Default: yes.')
      .addChoices(
      { name: 'Yes', value: 'variant-search' },
      { name: 'No', value: 'single-search' }
    )),
	async execute(interaction) {
    const lan = getLanguage('temp').findLogs;
    const items = [interaction.options.getString('item')];
    const months = interaction.options.getInteger('months') || 6;
    const variants = interaction.options.getString('variants');
    const checkVariants = !variants || variants.includes('variant') ? true : false;
    const reply = buildEmbed()
      .setTitle(`${lan.title} __${items[0]}__.`)
      .setDescription(
        `${lan.desc1}\n\n${lan.desc2}\n${lan.desc3}\n\n${lan.desc4}\n${lan.desc5}\n` +
        `${lan.desc6}\n${lan.desc7}\n${lan.desc8}\n${lan.desc9}\n${lan.desc10}`
      );
    
    await interaction.reply({ embeds: [reply], ephemeral: true });
    await logCommand(interaction);
    await searchLogs(interaction, items, months, checkVariants, lan);
	}
};