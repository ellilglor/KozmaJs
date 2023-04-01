const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { tradelogEmbed, buildEmbed, contentFilter } = require('@functions/general');
const { findLogs } = require('@functions/database/tradelogs');
const structures = require('@structures/findlogs');
const { globals } = require('@data/variables');

const searchLogs = async (interaction, items, months, checkVariants, checkClean, checkMixed) => {
  const unedited = items[0], reverse = [], ignore = [], stopHere = new Date();
  
  items[0] = contentFilter(items[0]);
  stopHere.setMonth(stopHere.getMonth() - months);

  const input = items[0].split(' ');
  input.forEach((word, index) => {
    structures.uvTerms.types.forEach(type => {
      word === type && structures.uvTerms.grades.forEach(grade => {
        if (input[index + 1] === grade) {
          uv = grade === 'very' && input[index + 2] === 'high' ? type + ' very high' : type + ' ' + grade;
          items[0] = (items[0].replace(uv, '') + ' ' + uv).replace(/ {2,}/g, ' ').trim();
        }
      });
    });
  });
  
  if (checkVariants) items = addVariants(items);
  if (/(?=.*ctr)(?=.*asi)/.test(items[0])) items.forEach(item => reverse.push(uvSwap(item)));
  if (checkClean) items.forEach(item => structures.cleanFilter.forEach(uv => ignore.push(`${item} ${uv}`)));
  if (/(?=.*blaster)(?!.*nog)/.test(items[0])) ignore.push('nog blaster');
  if (!items[0].includes('recipe')) ignore.push('recipe');

  const skipSpecial = structures.commonFeatured.some(item => items[0].includes(item));
  const checkForMatch = items.concat(reverse).toString().replace(/,/g, '.*|').concat('.*');
  const ignoreString = ignore.toString().replace(/,/g, '.*|').concat('.*');

  const matches = await findLogs(checkForMatch, stopHere, checkMixed, skipSpecial, ignoreString);
  const matchCount = matches.reduce((total, channel) => total += channel.messages.length, 0);

  for (const channel of matches) {
    const l = channel.messages.length;
    const embeds = [tradelogEmbed().setTitle(`I found ${l} post${l != 1 ? 's' : ''} in ${channel._id}:`).setColor('#f9d49c')];
    let charCount = 0;

    for (const message of channel.messages) {
      if (charCount + message.original.length > 6000 || embeds.length === 10) {
        await interaction.user.send({ embeds: embeds }).catch(error => error);
        embeds.splice(0, embeds.length);
        charCount = 0;
      }

      charCount += message.original.length;

      const embed = tradelogEmbed()
        .setTitle(message.date.toUTCString().slice(0,16))
        .setURL(message.messageUrl)
        .setDescription(message.original.slice(0,4096))
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
      'If you want me to look past that use the `months` option.\n\n' +
      'Only want to see your item and no variants?\nSet `variants` to *NO*.\n\n' +
      `Want to filter out higher value UV's?\nSet \`clean\` to *YES*.\n\n` +
      'Not interested in item trades?\nSet `mixed` to *NO*.\n\n' +
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

  if (/(?=.*drakon)|(?=.*maskeraith)/.test(items[0])) check = false;
  
  itemFamilyLoop:
  for (const family in structures.equipmentFamilies) {
    for (const name of structures.equipmentFamilies[family]) {
      if (!items[0].includes(name) || items[0].includes('nog')) continue;
      
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

        if (set === 'snipes' && /(?=.*slime)|(?=.*plume)/.test(items[0])) continue colorLoop;
      
        const template = items[0].replace(name, '').trim();

        if (name === 'rose' && (structures.roses.includes(template) || /(?=.*tabard)|(?=.*chapeau)/.test(template))) continue colorLoop;

        items.pop();
        if (/(?=.*obsidian)|(?=.*rose)/.test(set)) {
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