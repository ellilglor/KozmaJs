const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { tradelogEmbed, buildEmbed, contentFilter } = require('@functions/general');
const structures = require('@structures/findlogs');
const { globals } = require('@data/variables');
const fs = require('fs');

const searchLogs = async (interaction, items, months, checkVariants, checkMixed) => {
  const unedited = items[0];
  const stopHere = new Date();
  let reverse = ['ultron stinks'], logsFound = false;
  
  items[0] = contentFilter(items[0]);
  stopHere.setMonth(stopHere.getMonth() - months);

  if (checkVariants) items = addVariants(items);

  if (items[0].includes('ctr') && items[0].includes('asi')) {
    reverse = items.map(item => { return uvSwap(item) });
  }
  
  for (const [channel] of structures.channels) {
    if (channel === 'mixed-trades' && !checkMixed) continue;
    const messages = JSON.parse(fs.readFileSync(`src/data/tradelogs/${channel}.json`));
    const matches = [];
    let charCount = 0, firstMatch = false;

    for (const message of messages) {
      if (Date.parse(message.date) < Date.parse(stopHere)) break; 
      let sendMessage = false;
      
      if (channel.includes('special') && structures.commonFeatured.some(item => items.includes(item))) continue;

      items.every((item, ind) => {
        if (message.content.includes(item) || message.content.includes(reverse[ind])) sendMessage = true;
        return !sendMessage;
      });

      if (!sendMessage) continue;

      if (!firstMatch) {
        firstMatch = true;
        logsFound = true;
        const foundIn = tradelogEmbed().setTitle(`I found these posts in ${channel}:`).setColor('#f9d49c');
        matches.push(foundIn);
      }

      charCount += message.content.length;

      const embed = tradelogEmbed()
        .setTitle(message.date)
        .setURL(message.messageUrl)
        .setDescription(message.content.slice(0,4096));

      if (message.image) embed.setImage(message.image);

      if (matches.length === 10 || charCount >= 5900) {
        await interaction.user.send({ embeds: matches }).catch(error => error);
        matches.splice(0, matches.length);
        charCount = 0;
      } else { 
        matches.push(embed);
      }
    }

    if (matches.length !== 0) await interaction.user.send({ embeds: matches }).catch(error => error);
  }

  await searchFinished(interaction, logsFound, items[0], unedited, months, checkVariants);
};

const searchFinished = async (interaction, logsFound, item, unedited, months, checkVar) => {
  const embed = buildEmbed(interaction)
    .setTitle(`This is everything I found for __${unedited}__, I hope these helped!`)
    .setColor('#f9d49c')
    .setDescription(
      'By default I only look at tradelogs from the past 6 months!\n' +
      'If you want me to look past that use the *months* option.\n\n' +
      `If you notice a problem please contact @${globals.ownerTag}!\n` +
      `Did you know we have our own [**Discord server**](${globals.serverInvite} 'Kozma's Backpack Discord server')?`);

  if (!logsFound) embed.setTitle(`I couldn't find any listings for __${unedited}__.`); 

  structures.spreadsheet.every(equipment => {
    if (item.includes(equipment)) {
      embed.addFields([{ 
        name: '** **', 
        value: `__${unedited}__ can be found on the [**merchant sheet**]` +
          `(https://docs.google.com/spreadsheets/d/1h-SoyMn3kVla27PRW_kQQO6WefXPmLZYy7lPGNUNW7M/htmlview#).` 
      }]);
    }
    return embed.data.fields ? false : true;
  });

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('clear-messages').setLabel('Delete messages').setStyle('Primary')
  );

  if (months < 24) {
    buttons.addComponents(
      new ButtonBuilder()
        .setCustomId(`research${checkVar ? '-var' : ''}`).setLabel('Search all tradelogs').setStyle('Primary')
    );
  }

  try {
    await interaction.user.send({ embeds: [embed], components: [buttons] });
  } catch (error) {
    const errorEmbed = buildEmbed(interaction)
      .setTitle(`I can't send you any messages!`)
      .setColor('#e74c3c')
      .setDescription(
        'Make sure you have the following enabled:\n' +
        '*Allow direct messages from server members* in User Settings > Privacy & Safety\n\n' +
        `And Don't block me!`);
    await interaction.editReply({ embeds: [errorEmbed] });
  }
};

const addVariants = (items) => {
  let check = true;

  if (items[0].includes('drakon') || items[0].includes('maskeraith')) check = false;
  
  itemFamilyLoop:
  for (const family in structures.equipmentFamilies) {
    for (const name of structures.equipmentFamilies[family]) {
      if (!items[0].includes(name)) continue;
      
      const uvs = ' ' + items[0].replace(name, '').trim();
      items.pop();
      structures.equipmentFamilies[family].forEach(item => items.push(`${item}${uvs}`.trim()));
      check = false;
      break itemFamilyLoop;
    }
  }

  if (check) {
    colorLoop:
    for (const set in structures.colorSets) {
      for (const name of structures.colorSets[set]) {
        if (!items[0].includes(name)) continue;

        if (set === 'gems') {
          let stop = false;

          structures.gemExceptions.every(ex => {
            if (items[0].includes(ex)) stop = true;
            return !stop;
          });

          if (stop) continue colorLoop;
        }

        if (set === 'snipes' && (items[0].includes('slime') || items[0].includes('plume'))) continue colorLoop;
      
        const template = items[0].replace(name, '').trim();

        if (set === 'snipes' && name ==='rose') {
          if (structures.roses.includes(template) || template.includes('tabard') || template.includes('chapeau')) {
            continue colorLoop;
          }
        }

        items.pop();
        
        if (set === 'obsidian' || set.includes('rose')) {
          structures.colorSets[set].forEach(color => items.push(`${template} ${color}`.trim()));
        } else {
          structures.colorSets[set].forEach(color => items.push(`${color} ${template}`.trim()));
        }
        
        break colorLoop;
      }
    }
  }

  return items;
}

const uvSwap = (name) => {
	const name_list = name.split(' ');
	const ctr = name_list.indexOf('ctr');
	const asi = name_list.indexOf('asi');
  let result = '';

	for (i = 0; i < Math.min(ctr, asi); i++) {
		result += name_list[i] + ' ';
	}
	for (i = Math.max(ctr, asi); i < name_list.length; i++) {
		result += name_list[i] + ' ';
	}
	for (i = Math.min(ctr, asi); i < Math.max(ctr, asi); i++) {
		result += name_list[i] + ' ';
	}

	return result.trim();
};

module.exports = {
  searchLogs,
  contentFilter
};