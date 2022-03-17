const { SlashCommandBuilder } = require('@discordjs/builders');
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
			.addChoice('Copper', 'Copper')
      .addChoice('Steel', 'Steel')
      .addChoice('Silver', 'Silver')
      .addChoice('Platinum', 'Platinum')
      .addChoice('Gold', 'Gold')
      .addChoice('Titanium', 'Titanium')
      .addChoice('Iron', 'Iron')
      .addChoice('Mirrored', 'Mirrored')
      .addChoice('Slime', 'Slime')
      .addChoice('Colors', 'Colors'))
    .addStringOption(option =>
      option.setName('slime')
      .setDescription('Find where you can find a special themed box'))
    .addStringOption(option =>
      option.setName('item')
      .setDescription('Find which lockbox drops your item')),
	async execute(interaction) {
    let box = interaction.options.getString('boxes');
    const slime = interaction.options.getString('slime');
    const item = interaction.options.getString('item');
    const reply = buildEmbed();
    await logCommand(interaction);

    if (box) {
      const match = findBox(box);
      if (box !== 'Colors') { 
        reply.setThumbnail(getImage('Boxes', box));
        box = box.concat(' ', 'Lockbox');
      }
      reply.setTitle(`${box.toUpperCase()}:`).setDescription(match);
    } else if (slime) {
      if (slime.length > 2) {
        const match = findSlimeBox(slime);
        reply.setTitle(match || `I didn't find a match for __${slime}__.`.slice(0,256));
      } else { 
        reply.setTitle(`Please put in at least 3 letters.`); 
      }
    } else if (item) {
      if (item.length > 2) {
        const match = findItem(item);
        match ? reply.setTitle(`These lockboxes contain __${item}__:`).setDescription(match) : reply.setTitle(`I didn't find a box containing __${item}__.`.slice(0,256));
      } else { 
        reply.setTitle(`Please put in at least 3 letters.`); 
      }
    } else {
      reply.setTitle('Please select 1 of the given options.');
    }

    await interaction.reply({embeds: [reply], ephemeral: true});
	}
};