const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { tradelogEmbed, buildEmbed, contentFilter } = require('@functions/general');
const { findLogs } = require('@functions/database/tradelogs');
const structures = require('@structures/findlogs');
const { globals } = require('@data/variables');

const searchLogs = async (interaction, items, months, checkVariants, checkClean, checkMixed) => {
  const unedited = items[0], reverse = [], dirty = [], stopHere = new Date();
  
  items[0] = contentFilter(items[0]);
  stopHere.setMonth(stopHere.getMonth() - months);

  const inputArray = items[0].split(' ');
  const first = inputArray.filter(word => !structures.uvTerms.includes(word)).toString().replace(/,/g, ' ');
  const last = inputArray.filter(word => structures.uvTerms.includes(word)).toString().replace(/,/g, ' ');
  items[0] = first.concat(' ', last);

  if (checkVariants) items = addVariants(items);
  if (/(?=.*ctr)(?=.*asi)/.test(items[0])) items.forEach(item => reverse.push(uvSwap(item)));
  if (checkClean) items.forEach(item => structures.cleanFilter.forEach(uv => dirty.push(`${item} ${uv}`)));
  if (items[0].includes('blaster') && !items[0].includes('nog')) dirty.push('nog blaster');

  const skipSpecial = structures.commonFeatured.some(item => items[0].includes(item));
  const checkForMatch = items.concat(reverse).toString().replace(/,/g, '.*|').concat('.*');
  const dirtyString = dirty.toString().replace(/,/g, '.*|').concat('.*');

  const matches = await findLogs(checkForMatch, stopHere, checkMixed, skipSpecial, dirtyString);
  const matchCount = matches.reduce((total, channel) => total += channel.messages.length, 0);

  for (const channel of matches) {
    const l = channel.messages.length;
    const embeds = [tradelogEmbed().setTitle(`I found ${l} post${l != 1 ? 's' : ''} in ${channel._id}:`).setColor('#f9d49c')];
    let charCount = 0;

    for (const message of channel.messages) {
      if (charCount + message.content.length > 6000 || embeds.length === 10) {
        await interaction.user.send({ embeds: embeds }).catch(error => error);
        embeds.splice(0, embeds.length);
        charCount = 0;
      }

      charCount += message.content.length;

      const embed = tradelogEmbed()
        .setTitle(message.date.toUTCString().slice(0,16))
        .setURL(message.messageUrl)
        .setDescription(message.content.slice(0,4096))
        .setImage(message.image);

      embeds.push(embed);
    }
    
    if (embeds.length !== 0) await interaction.user.send({ embeds: embeds }).catch(error => error);
  }

  await searchFinished(interaction, matchCount, items[0], unedited, months, checkVariants);
};

const searchFinished = async (interaction, matchCount, item, unedited, months, checkVar) => {
  const embed = buildEmbed(interaction)
    .setTitle(`I found ${matchCount} message${matchCount != 1 ? 's' : ''} containing __${unedited}__`)
    .setColor('#f9d49c')
    .setDescription(
      'By default I only look at tradelogs from the past **6 months**!\n' +
      'If you want me to look past that use the *months* option.\n\n' +
      `If you notice a problem please contact @${globals.ownerTag}!\n` +
      `Did you know we have our own [**Discord server**](${globals.serverInvite} 'Kozma's Backpack Discord server')?`);

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
};