const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('../../functions/general');
const { searchLogs } = require('../../functions/commands/findlogs');

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
    const items = [interaction.options.getString('item')];
    const months = interaction.options.getInteger('months') || 6;
    const variants = interaction.options.getString('variants');
    const checkVariants = !variants || variants.includes('variant') ? true : false;
    const reply = buildEmbed()
      .setTitle(`Searching for __${items[0]}__.`)
      .setDescription(
        `**I will dm you what I can find.**\n\n` +
        `By default I only look at tradelogs from the past 6 months!\n` +
        `If you want me to look past that use the *months* option.\n\n` +
        `__**Info when searching:**__\n` +
        `~ Slime boxes: combination first then *slime lockbox*\n` + `Example: QQQ Slime Lockbox\n` +
        `~ UV'd equipment: use asi / ctr + med / high / very high / max\n` +
        `The bot automatically swaps asi & ctr so you don't have to search twice.\n` +
        `~ Equipment: The bot looks for the entire family tree of your item!\n` +
        `So when you lookup *brandish* it will also look for *combuster* for example\n` +
        `~ Sprite pods: type out as seen in game\n` + `Example: Drakon Pod (Divine)`);
      await interaction.reply({ embeds: [reply], ephemeral: true });
      await logCommand(interaction);
      await searchLogs(interaction, items, months, checkVariants);
	}
};