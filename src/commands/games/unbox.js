const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { buildEmbed, logCommand } = require('../../functions/general');
const { unbox, getImage } = require('../../functions/commands/unbox');
const { lockboxes, depotBoxes } = require('../../data/structures/unbox')
const wait = require('util').promisify(setTimeout);

const items = {};

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
      .addChoice('Spritely', 'Spritely')
      .addChoice('Lucky', 'Lucky')),
  async execute(interaction, showStats, option, opened, spent) {
    const box = option || interaction.options.getString('box');
    const amount = opened || '1';
    const boxImage = getImage('Boxes', box);
    let unboxed = 'placeholder';
    let itemImage = 'placeholder';
    
    if (!showStats) {
      unboxed = unbox(box);
      itemImage = getImage(box, unboxed.toString());
      await logCommand(interaction, option, unboxed);
    }

    const id = interaction.user.id
    if (!items[id]) {
      items[id] = {};
    }

    if (!showStats) {
      if (!items[id][box] || !option) { items[id][box] = {} }
      for (const item of unboxed) {
        items[id][box][item] = items[id][box][item] + 1 || 1;
      }
    }
    
    if (lockboxes.includes(box)) {
      totalSpent = spent || '750';
      money = false;
    } else if (depotBoxes.includes(box)){
      totalSpent = spent || '3495';
      money = false;
    } else {
      totalSpent = spent || '4.95';
      money = true;
    }

    const openedEmbed = buildEmbed();
    openedEmbed.setAuthor({ name: box, iconURL: boxImage})
      .addField('Opened:', `${amount}`, true)
      .addField('Total spent:', money ? `$${totalSpent}` : `${totalSpent} Energy`, true);
      
    if (showStats) {
      items[id][box] = Object.fromEntries(
        Object.entries(items[id][box]).sort(([,a],[,b]) => b-a)
      );

      let embedDesc = '**In this session you opened:**';
      for (const key in items[id][box]) {
        embedDesc = embedDesc.concat('\n',`${key} : ${items[id][box][key]}`);
        if (embedDesc.length >= 4030) {
          embedDesc = embedDesc.concat('\n',`**I have reached the character limit!**`);
          break;
        }
      }

      openedEmbed.setDescription(embedDesc);
    } else {
      openedEmbed.setTitle('You unboxed:')
        .setDescription(`*${unboxed.toString().replace(/,/g, ' & ')}*`)
        .setThumbnail(itemImage);
    }

    const buttons = new MessageActionRow()
    .addComponents(new MessageButton()
				.setCustomId('unbox-again')
				.setEmoji('🔁')
				.setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('unbox-stats')
        .setEmoji('🐋')
				.setStyle('SECONDARY')
        .setDisabled(showStats)
		);

    if (!showStats) {
      const reply = buildEmbed();
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
      await interaction.editReply({embeds: [openedEmbed], components: [buttons]});
	  } else {
      await interaction.update({embeds: [openedEmbed], components: [buttons]});
    }
	}
};