const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('@functions/general');
const { searchLogs } = require('./functions/findlogs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('findlogs')
		.setDescription('Search the tradelog database for any item.')
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
      .setMaxValue(120))
    .addStringOption(option =>
		  option.setName('variants')
			.setDescription('Check for color variants / item family tree. Default: yes.')
      .addChoices(
      { name: 'Yes', value: 'variant-search' },
      { name: 'No', value: 'single-search' }))
    .addStringOption(option =>
		  option.setName('clean')
			.setDescription('Filter out high value uvs. Default: no.')
      .addChoices(
      { name: 'Yes', value: 'clean-search' },
      { name: 'No', value: 'dirty-search' }))
    .addStringOption(option =>
		  option.setName('mixed')
			.setDescription('Check the mixed-trades channel. Default: yes.')
      .addChoices(
      { name: 'Yes', value: 'mixed-search' },
      { name: 'No', value: 'mixed-ignore' })),
	async execute(interaction) {
    const items = [interaction.options.getString('item')];
    const months = interaction.options.getInteger('months') || 6;
    const checkVariants = interaction.options.getString('variants')?.includes('single') ? false : true;
    const checkClean = interaction.options.getString('clean')?.includes('clean') ? true : false;
    const checkMixed = interaction.options.getString('mixed')?.includes('ignore') ? false : true;

    const reply = buildEmbed(interaction)
      .setTitle(`Searching for __${items[0]}__, I will dm you what I can find.`)
      .setDescription(
        '### Info & tips when searching:\n' +
        '- **Slime boxes**:\n' + 
         'combination followed by *slime lockbox*\nExample: QQQ Slime Lockbox\n' +
        `- **UV's**:\n` + `use asi / ctr + med / high / very high / max\n` +
        `The bot automatically swaps asi & ctr so you don't have to search twice.\n` +
        'Example: Brandish ctr very high asi high\n' +
        '- **Equipment**:\n' + 'The bot looks for the entire family tree of your item!\n' +
        'So when you lookup *brandish* it will also match on *Combuster* & *Acheron*\n' +
        '- **Color Themes**:\n' + 'certain colors with (expected) similar value are grouped for more results.' +
        ' Some examples include *Divine* & *Volcanic*, tech colors, standard colors, etc.\n' +
        '- **Sprite pods**:\n' + 'type out as seen in game\nExample: Drakon Pod (Divine)'
      );
    
    await interaction.editReply({ embeds: [reply] });
    await logCommand(interaction);
    await searchLogs(interaction, items, months, checkVariants, checkClean, checkMixed);
	}
};