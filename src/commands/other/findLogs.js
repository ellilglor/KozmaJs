const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed, logCommand } = require('../../functions/general');
const { searchLogs } = require('../../functions/commands/findlogs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('findlogs')
		.setDescription('Search the tradelog database for an item.')
    .addStringOption(option =>
		  option.setName('item')
			.setDescription('Item the bot should look for.')
			.setRequired(true))
    .addIntegerOption(option =>
		  option.setName('months')
			.setDescription('How far back the bot should search. Default: 3 months.')
      .setMinValue(1)
      .setMaxValue(24))
    .addStringOption(option =>
		  option.setName('variants')
			.setDescription('Check for color variants / item family tree. Default: yes.')
      .addChoice('Yes', 'variant-search')
      .addChoice('No', 'single-search')),
	async execute(interaction) {
    const items = [interaction.options.getString('item')];
    const months = interaction.options.getInteger('months') || 3;
    const variants = interaction.options.getString('variants');
    const checkVariants = !variants || variants.includes('variant') ? true : false;
    const reply = buildEmbed().setDescription(`**I will dm you what I can find.**\n\nBy default I only look at tradelogs from the past 3 months!\nIf you want me to look past that use the *months* option.\n\n__**Info when searching:**__\n~ Slime boxes: combination first then *slime lockbox*\nExample: QQQ Slime Lockbox\n~ UV'd equipment: use asi / ctr + med / high / very high / max\nThe bot automatically swaps asi & ctr so you don't have to search twice.\n~ Equipment: The bot looks for the entire family tree of your item!\nSo when you lookup *brandish* it will also look for *combuster* for example\n~ Sprite pods: type out as seen in game\nExample: Drakon Pod (Divine)`);
    await logCommand(interaction);
    
    if (items[0].length > 2) {
      reply.setTitle(`Searching for __${items[0]}__.`.slice(0,256));
      await interaction.reply({embeds: [reply], ephemeral: true});
      await searchLogs(interaction, items, months, checkVariants);
    } else { 
      reply.setTitle('Please put in at least 3 letters.');
      await interaction.reply({embeds: [reply], ephemeral: true});
    };
	}
};