const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('../../functions/general');
const { findBox, findSlimeBox, findItem } = require('../../functions/commands/lockbox');
const { getImage } = require('../../functions/commands/unbox');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lockbox')
		.setDescription('Get the drops from a (slime) lockbox or find what box drops your item.')
    .addStringOption(option =>
		  option.setName('boxes')
			.setDescription('Get the odds from a lockbox.')
      .addChoices(
      { name: 'Copper', value: 'Copper' },
      { name: 'Steel', value: 'Steel' },
      { name: 'Silver', value: 'Silver' },
      { name: 'Platinum', value: 'Platinum' },
      { name: 'Gold', value: 'Gold' },
      { name: 'Titanium', value: 'Titanium' },
      { name: 'Iron', value: 'Iron' },
      { name: 'Mirrored', value: 'Mirrored' },
      { name: 'Slime', value: 'Slime' },
      { name: 'Colors', value: 'Colors' }
    ))
    .addStringOption(option =>
      option.setName('slime')
      .setDescription('Find where you can find a special themed box.')
      .setMinLength(3)
      .setMaxLength(69))
    .addStringOption(option =>
      option.setName('item')
      .setDescription('Find which lockbox drops your item.')
      .setMinLength(3)
      .setMaxLength(69)),
	async execute(interaction) {
    let box = interaction.options.getString('boxes');
    const slime = interaction.options.getString('slime');
    const item = interaction.options.getString('item');
    const reply = buildEmbed();

    if (box) {
      const match = findBox(box);
      if (box !== 'Colors') { 
        reply.setThumbnail(getImage('Boxes', box));
        box = box.concat(' ', 'Lockbox');
      }
      reply.setTitle(`${box.toUpperCase()}:`).setDescription(match);
    } else if (slime) {
        const match = findSlimeBox(slime);
        reply.setTitle(match || `I didn't find a match for __${slime}__.`);
    } else if (item) {
        const match = findItem(item);
        match ? reply.setTitle(`These lockboxes contain __${item}__:`).setDescription(match) : reply.setTitle(`I didn't find a box containing __${item}__.`);
    } else {
      reply.setTitle('Please select 1 of the given options.');
    }

    await interaction.reply({ embeds: [reply], ephemeral: true });
    await logCommand(interaction);
	}
};