const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { findBox, findSlimeBox, findItem } = require('@functions/commands/lockbox');
const { buildEmbed, logCommand, getLanguage } = require('@functions/general');
const { getImage } = require('@functions/commands/unbox');

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
    const lan = getLanguage('temp').lockbox;
    let box = interaction.options.getString('boxes');
    const slime = interaction.options.getString('slime');
    const item = interaction.options.getString('item');
    const reply = buildEmbed(interaction).setTitle(lan.title);

    if (box) {
      const match = findBox(box);
      if (box !== 'Colors') { 
        reply.setThumbnail(getImage('Boxes', box));
        box = box.concat(' ', 'Lockbox');
      }
      reply.setTitle(`${box.toUpperCase()}:`).setDescription(match);
    } else if (slime) {
      const match = findSlimeBox(slime);
      reply.setTitle(match || `${lan.noMatch} __${slime}__.`);
    } else if (item) {
      const match = findItem(item);
      reply.setTitle(match ? `${lan.item} __${item}__:` : `${lan.noItem} __${item}__.`).setDescription(match || null);
    } 

    const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setURL('https://docs.google.com/spreadsheets/d/14FQWsNevL-7Uiiy-Q3brif8FaEaH7zGGR2Lv_JkOyr8/htmlview')
        .setLabel('Lockboxes').setStyle('Link'),
      new ButtonBuilder()
				.setURL('https://docs.google.com/spreadsheets/d/1f9KQlDcQcoK3K2z6hc7ZTWD_SnrikdTkTXGppneq0YU/htmlview')
        .setLabel('Slime Lockboxes').setStyle('Link')
		);

    await interaction.reply({ embeds: [reply], components: [buttons], ephemeral: true });
    await logCommand(interaction);
	}
};