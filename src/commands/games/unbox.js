const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
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
      .addChoices(
      { name: 'Copper', value: 'Copper' },
      { name: 'Steel', value: 'Steel' },
      { name: 'Silver', value: 'Silver' },
      { name: 'Platinum', value: 'Platinum' },
      { name: 'Gold', value: 'Gold' },
      { name: 'Titanium', value: 'Titanium' },
      { name: 'Iron', value: 'Iron' },
      { name: 'Mirrored', value: 'Mirrored' },
      { name: 'QQQ', value: 'Slime' },
      { name: 'Equinox', value: 'Equinox' },
      { name: 'Confection', value: 'Confection' },
      { name: 'Spritely', value: 'Spritely' },
      { name: 'Lucky', value: 'Lucky' }
    )),
  async execute(interaction, showStats, choice, opened, spent) {
    const box = choice || interaction.options.getString('box');
    const id = interaction.user.id;
    const amount = opened || '1';
    const boxImage = getImage('Boxes', box);
    let desc = '**In this session you opened:**', total = 0, money = false;

    if (!items[id]) items[id] = {};

    if (lockboxes.includes(box)) {
      total = spent || '750';
    } else if (depotBoxes.includes(box)) {
      total = spent || '3495';
    } else {
      total = spent || '4.95';
      money = true;
    }

    const result = buildEmbed()
      .setAuthor({ name: box, iconURL: boxImage})
      .addFields([
        { name: 'Opened:', value: `${amount}`, inline: true },
        { name: 'Total spent:', value: money ? `$${total}` : `${total} Energy`, inline: true }
      ]);
    
    if (showStats) {
      if (!items[id][box]) {
        result.setDescription(`The bot has restarted and this data is lost!`);
      } else {
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

        result.setDescription(desc);
      }
    } else {
      const unboxed = unbox(box);
      desc = unboxed.map(item => { return item.name; }).toString().replace(/,/g, ' & ');
      
      await logCommand(interaction, choice, desc);

      if (!items[id][box] || !choice) items[id][box] = {};
      for (const item of unboxed) {
        items[id][box][item.name] = items[id][box][item.name] + 1 || 1;
      }

      result.setTitle('You unboxed:').setDescription(`*${desc}*`).setThumbnail(unboxed[0].url);
    }

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
				.setCustomId('unbox-again').setEmoji('🔁').setStyle('Secondary'),
      new ButtonBuilder()
        .setCustomId('unbox-stats').setEmoji('📘').setStyle('Secondary')
        .setDisabled(showStats)
		);

    if (!showStats) {
      const reply = buildEmbed()
        .setTitle(`Opening your box`)
        .setDescription('3...')
        .setAuthor({ name: box, iconURL: boxImage});
      const message = { embeds: [reply], components: [], ephemeral: true };
      choice ? await interaction.update(message) : await interaction.reply(message);

      await wait(1000); await interaction.editReply({ embeds: [reply.setDescription('2...')] });
      await wait(1000); await interaction.editReply({ embeds: [reply.setDescription('1...')] });
      await wait(1000); await interaction.editReply({ embeds: [result], components: [buttons] });
	  } else {
      await interaction.update({ embeds: [result], components: [buttons] });
    }
	}
};