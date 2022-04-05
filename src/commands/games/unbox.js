const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { buildEmbed, logCommand } = require('../../functions/general');
const { unbox, getImage } = require('../../functions/commands/unbox');
const { lockboxes, depotBoxes } = require('../../data/structures/unbox');
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
      .addChoice('QQQ', 'Slime')
      .addChoice('Equinox', 'Equinox')
      .addChoice('Confection', 'Confection')
      .addChoice('Spritely', 'Spritely')
      .addChoice('Lucky', 'Lucky')),
  async execute(interaction, showStats, choice, opened, spent) {
    const box = choice || interaction.options.getString('box');
    const amount = opened || '1';
    const boxImage = getImage('Boxes', box);
    let unboxed = 'placeholder';
    let desc = '**In this session you opened:**';

    const id = interaction.user.id;
    if (!items[id]) items[id] = {};
    
    if (!showStats) {
      unboxed = unbox(box);
      desc = unboxed.map(function(item){ return item.name; }).toString().replace(/,/g, ' & ');
      await logCommand(interaction, choice, desc);

      if (!items[id][box] || !choice) items[id][box] = {};
      for (const item of unboxed) {
        items[id][box][item.name] = items[id][box][item.name] + 1 || 1;
      }
    }

    let money = false;
    if (lockboxes.includes(box)) {
      totalSpent = spent || '750';
    } else if (depotBoxes.includes(box)){
      totalSpent = spent || '3495';
    } else {
      totalSpent = spent || '4.95';
      money = true;
    }

    const embed = buildEmbed()
      .setAuthor({ name: box, iconURL: boxImage})
      .addField('Opened:', `${amount}`, true)
      .addField('Total spent:', money ? `$${totalSpent}` : `${totalSpent} Energy`, true);
      
    if (showStats) {
      // sort items from most to least opened
      items[id][box] = Object.fromEntries(
        Object.entries(items[id][box]).sort(([,a],[,b]) => b-a)
      );

      for (const key in items[id][box]) {
        desc = desc.concat('\n',`${key} : ${items[id][box][key]}`);
        if (desc.length >= 4030) {
          desc = desc.concat('\n',`**I have reached the character limit!**`);
          break;
        }
      }

      embed.setDescription(desc);
    } else {
      embed
        .setTitle('You unboxed:')
        .setDescription(`*${desc}*`)
        .setThumbnail(unboxed[0].url);
    }

    const buttons = new MessageActionRow()
      .addComponents(
      new MessageButton()
				.setCustomId('unbox-again')
				.setEmoji('🔁')
				.setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('unbox-stats')
        .setEmoji('📘')
				.setStyle('SECONDARY')
        .setDisabled(showStats)
		);

    if (!showStats) {
      const reply = buildEmbed()
        .setTitle(`Opening your box`)
        .setDescription('3...')
        .setAuthor({ name: box, iconURL: boxImage});
    choice ? await interaction.update({embeds: [reply], components: []}) : await interaction.reply({embeds: [reply], ephemeral: true});
      await wait(1000);
      reply.setDescription('2...');
      await interaction.editReply({embeds: [reply]});
      await wait(1000);
      reply.setDescription('1...');
      await interaction.editReply({embeds: [reply]});
      await wait(1000);
      await interaction.editReply({embeds: [embed], components: [buttons]});
	  } else {
      await interaction.update({embeds: [embed], components: [buttons]});
    }
	}
};