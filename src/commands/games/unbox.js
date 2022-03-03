const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { buildEmbed, logCommand } = require('../../functions/general');
const { unbox, getImage } = require('../../functions/commands/unbox');
const wait = require('util').promisify(setTimeout);

const lockboxes = ['Copper', 'Steel', 'Silver', 'Platinum', 'Gold', 'Titanium', 'Iron', 'Mirrored'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unbox')
		.setDescription(`Simulate opening a box.`)
    .addStringOption(option =>
		  option.setName('box')
			.setDescription('Select the box you want to open.')
      .setRequired(true)
			.addChoice('Copper', 'Copper')
      .addChoice('Steel', 'Steel')
      .addChoice('Silver', 'Silver')
      .addChoice('Platinum', 'Platinum')
      .addChoice('Gold', 'Gold')
      .addChoice('Titanium', 'Titanium')
      .addChoice('Iron', 'Iron')
      .addChoice('Mirrored', 'Mirrored')
      .addChoice('Equinox', 'Equinox')
      .addChoice('Confection', 'Confection')
      .addChoice('Spritely', 'Spritely')),
	async execute(interaction, option, opened, spent) {
    const reply = buildEmbed();
    const box = option || interaction.options.getString('box');
    const amount = opened || '1';
    const unboxed = unbox(box);
    await logCommand(interaction, option, unboxed);
    const boxImage = getImage('Boxes', box);
    const itemImage = getImage(box, unboxed);

    if (lockboxes.includes(box)) {
      totalSpent = spent || '750';
      money = false;
    } else {
      totalSpent = spent || '4.95';
      money = true;
    }

    const buttons = new MessageActionRow()
      .addComponents(new MessageButton()
				.setCustomId('again')
				.setEmoji('🔁')
				.setStyle('SECONDARY'),
		  );

    const result = buildEmbed();
    result.setTitle('You unboxed:')
      .setDescription(`*${unboxed}*`)
      .setAuthor({ name: box, iconURL: boxImage})
      .setThumbnail(itemImage)
      .addField('Opened:', `${amount}`, true)
      .addField('Total spent:', money ? `$${totalSpent}` : `${totalSpent} Energy`, true);
    
    reply.setTitle(`Opening your box`)
      .setDescription('3...')
      .setAuthor({ name: box, iconURL: boxImage});
    option ? await interaction.update({embeds: [reply], components: []}) : await interaction.reply({embeds: [reply], ephemeral: true});
    await wait(1000);
    reply.setDescription('2...');
    await interaction.editReply({embeds: [reply]});
    await wait(1000);
    reply.setDescription('1...');
    await interaction.editReply({embeds: [reply]});
    await wait(1000);
    await interaction.editReply({embeds: [result], components: [buttons]});
	}
};