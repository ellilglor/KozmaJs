const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('@functions/general');
const { unbox } = require('@functions/commands/unbox');
const { boxes } = require('@structures/unbox');
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
    const boxData = boxes.get(box);
    const author = { name: box, iconURL: boxData.url };
    const total = spent || boxData.price;
    const money = boxData.currency === '$' ? true : false;
    const id = interaction.user.id;
    const amount = opened || '1';
    let desc = '**In this session you opened:**';

    if (!items[id]) items[id] = {};

    const result = buildEmbed(interaction)
      .setAuthor(author)
      .addFields([
        { name: 'Opened:', value: amount.toLocaleString('en'), inline: true },
        { name: 'Total spent:', value: money ? `$${total}` : `${total.toLocaleString('en')} Energy`, inline: true }
      ]);
    
    if (showStats) {
      if (!items[id][box]) {
        result.setDescription('The bot has restarted and this data is lost!');
      } else {
        // sort items from most to least opened
        items[id][box] = Object.fromEntries(
          Object.entries(items[id][box]).sort(([,a],[,b]) => b-a)
        );

        Object.entries(items[id][box]).every(([item, amount]) => {
          desc = desc.concat('\n', desc.length < 4030 ? `${item} : ${amount}` : '**I have reached the character limit!**');
          return desc.length < 4030 ? true : false;
        });

        result.setDescription(desc);
      }
    } else {
      const unboxed = unbox(box);
      desc = unboxed.reduce((d, item) => d.concat(' & ', item.name), '').replace(' & ', '');
      
      await logCommand(interaction, choice, desc);

      if (!items[id][box] || !choice) items[id][box] = {};
      unboxed.forEach(item => { items[id][box][item.name] = items[id][box][item.name] + 1 || 1 });
      
      result.setTitle('You unboxed:').setDescription(`*${desc}*`).setThumbnail(unboxed[0].url);
    }

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
				.setCustomId('unbox-again').setEmoji('🔁').setStyle('Secondary'),
      new ButtonBuilder()
        .setCustomId('unbox-stats').setEmoji('📘').setStyle('Secondary')
        .setDisabled(showStats)
		);

    if (amount === '69') {
      buttons.addComponents(
        new ButtonBuilder().setURL('https://www.gamblersanonymous.org/ga/').setEmoji('💰').setStyle('Link')
      );
    }

    if (!showStats) {
      const reply = buildEmbed(interaction).setTitle('Opening your box').setDescription('3...').setAuthor(author);
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