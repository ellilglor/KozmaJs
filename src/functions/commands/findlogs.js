const { tradelogEmbed, buildEmbed, contentFilter } = require('../../functions/general');
const { spreadsheet, equipmentFamilies, colorSets, channels, roses } = require('../../data/structures/findlogs');
const fs = require('fs');

const searchLogs = async (interaction, items, months, checkVariants) => {
  items[0] = contentFilter(items[0]);
  let logsFound = false;
  const reverse = ['ultron stinks'];
  const stopHere = new Date();

  stopHere.setMonth(stopHere.getMonth() - months);

  if (checkVariants) {
    items = addVariants(items);
  }

  if (items[0].includes('ctr') && items[0].includes('asi')) {
    reverse.pop();
    for (const item of items) {
      reverse.push(uvSwap(item))
    }
  }

  for (const channel of channels) {
    const messages = JSON.parse(fs.readFileSync(`src/data/tradelogs/${channel[0]}.json`));
    const matches = [];
    let firstMatch = false;

    for (const message of messages) {
      let sendMessage = false;
      if (Date.parse(message.date) < Date.parse(stopHere)) { 
        break; 
      }

      for (const x in items) {
        if (message.content.includes(items[x]) || message.content.includes(reverse[x])) {
          sendMessage = true;
          break;
        }
      }

      if (!sendMessage) { continue }

      if (!firstMatch) {
        firstMatch = true;
        logsFound = true;
        const foundIn = tradelogEmbed()
          .setTitle(`I found these posts in ${channel[0]}:`)
          .setColor('#f9d49c');
        matches.push(foundIn);
      }

      const msg = tradelogEmbed()
        .setTitle(message.date)
        .setDescription(message.content.slice(0,4096));

      if (message.image) { msg.setImage(message.image); }

      if (matches.length === 10) {
        await interaction.user.send({embeds: matches});
        matches.splice(0, matches.length);
      } else { 
        matches.push(msg);
      }
    }

    if (matches.length !== 0) {
      await interaction.user.send({embeds: matches});
    }
  }

  await searchFinished(interaction, logsFound, items[0]);
};

const searchFinished = async (interaction, logsFound, item) => {
  const message = buildEmbed()
    .setColor('#f9d49c')
    .setDescription('By default I only look at tradelogs from the past 3 months!\nIf you want me to look past that use the *months* option.\n\nIf you notice a problem please contact @ellilglor#6866!\nDid you know we have our own discord server?\n<https://discord.gg/nGW89SHHj3>');

  if (logsFound) {
    message.setTitle(`I couldn't find anything else for __${item}__, hope these helped!`.slice(0,256));
  } else { 
    message.setTitle(`I couldn't find any listings for __${item}__.`.slice(0,256)); 
  }

  for (const equipment of spreadsheet) {
    if (item.includes(equipment)) {
      message.addField('** **', `__${item}__ can be found on the merchant sheet:\n https://docs.google.com/spreadsheets/d/1h-SoyMn3kVla27PRW_kQQO6WefXPmLZYy7lPGNUNW7M/htmlview#`, false);
    }
  }

  //console.log(`finished /search ${item} for ${interaction.user.tag}`);
  await interaction.user.send({embeds: [message]});
};

const addVariants = (items) => {
  let check = true;
  
  itemFamilyLoop:
  for (const family in equipmentFamilies) {
    for (const name of equipmentFamilies[family]) {
      if (!items[0].includes(name)) { continue; }
      
      const uvs = ' ' + items[0].replace(name, '').trim();
      items.pop();
      for (const item of equipmentFamilies[family]) {
        items.push(`${item}${uvs}`.trim());
      }
      check = false;
      break itemFamilyLoop;
    }
  }

  if (check) {
    colorLoop:
    for (const set in colorSets) {
      for (const name of colorSets[set]) {
        if (!items[0].includes(name)) { continue; }

        if (set.includes('gems')) {
          if (items[0].includes('bout') || items[0].includes('rose') || items[0].includes('tabard') || items[0].includes('chapeau') || items[0].includes('buckled') || items[0].includes('clover') || items[0].includes('pipe') || items[0].includes('lumberfell')) {
            continue;
          }
        }

        if (items[0].includes('drakon') || items[0].includes('maskeraith')) {
          continue;
        }

        if (set.includes('snipes') && items[0].includes('slime')) {
          continue;
        } 
      
        const template = items[0].replace(name, '').trim();

        if (set.includes('snipes') && name.includes('rose')) {
          if (roses.includes(template) || template.includes('tabard') || template.includes('chapeau')) {
            continue;
          }
        }

        items.pop();
        if (set.includes('obsidian') || set.includes('rose')) {
          for (const color of colorSets[set]) {
            const variant = `${template} ${color}`;
            items.push(variant.trim());
          }
        } else {
          for (const color of colorSets[set]) {
            const variant = `${color} ${template}`;
            items.push(variant.trim());
          }
        }
        
        break colorLoop;
      }
    }
  }

  return items;
}

const uvSwap = (name) => {
	let result = '';
	const name_list = name.split(' ');
	const ctr = name_list.indexOf('ctr');
	const asi = name_list.indexOf('asi');

	for (i = 0; i < Math.min(ctr, asi); i++) {
		result += name_list[i] + ' ';
	}
	for (i = Math.max(ctr, asi); i < name_list.length; i++) {
		result += name_list[i] + ' ';
	}
	for (i = Math.min(ctr, asi); i < Math.max(ctr, asi); i++) {
		result += name_list[i] + ' ';
	}

	result = result.slice(0, -1);
	return result;
};

module.exports = {
  searchLogs,
  contentFilter
};