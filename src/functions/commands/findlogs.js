const { tradelogEmbed, buildEmbed } = require('../../functions/general');
const { items, colors, exceptionsCheck, exceptions, spreadsheet, equipmentFamilies, colorSets } = require('../../data/structures/findlogs');
const fs = require('fs');

const roses = ['black', 'red', 'white', 'blue', 'gold', 'green', 'coral', 'violet', 'moonstone', 'malachite', 'garnet', 'amethyst', 'citrine', 'prismatic', 'aquamarine', 'turquoise'];

const findChannels = (item) => {
  const result = ['mixed-trades'];
  item = contentFilter(item);

  if (colors.includes(item)) {
    for (const channel in items) {
      result.push(channel);
    }
    return result;
  }

  for (const channel in items) {
    for (const name of items[channel]) {
      if (item.includes(name)) {
        if (item.includes('recipe')) {
          result.push('miscellaneous');
        }

        for (const check of exceptionsCheck) {
          if (!name.includes(check)) { continue; }

          if (exceptions.includes(item)) {
            result.push('equipment');
           }

          if (name.includes('plate helm') || name.includes('plate mail')) {
            item.includes('volcanic') ? result.push('costumes', 'equipment') : result.push('costumes');
          } else { 
            result.push('costumes');
          };
        };

        if (name.includes('airbraker shield')) {
          item.slice(0,1).includes('a') ? result.push('equipment') : result.push('costumes');
        };

        if (name.includes('pipe')) {
          item.includes('exhaust') ? result.push('armor-back') : result.push('helm-front');
        };

        if (name.includes('rose')) {
          if (item.includes('tabard') || item.includes('chapeau')) {
            result.push('costumes');
          } else {
            item.includes('aura') ? result.push('armor-aura') : result.push('helm-side');
          }
        };

        if (name.includes('clover')) {
          if (item.includes('lapel')) {
            result.push('armor-front');
          } else {
            item.includes('eyes') ? result.push('miscellaneous') : result.push('helm-top');
          }
        };

        if (name.includes('wrench')) {
          item.includes('wand') ? result.push('equipment') : result.push('armor-back');
        };

        if (name.includes('spiraltail')) {
          if (item.includes('mask') || item.includes('mail')) {
            result.push('costumes');
          } else { 
            result.push('armor-rear'); 
          }
        };

        if (name.includes('plume')) {
          item.includes('cap') ? result.push('costumes') : result.push('helm-back');
        };

        if (name.includes('seedling')) {
          item.includes('virulent') ? result.push('equipment') : result.push('armor-front');
        };

        if (result.length === 1) { result.push(channel); }

        return result;
      };
    };
  };

  result.push('miscellaneous', 'Sprite Food', 'Materials');
  return result;
};

const searchLogs = async (interaction, channels, items, months, checkVariants) => {
  items[0] = contentFilter(items[0]);
  let logsFound = false;
  const reverse = ['ultron stinks'];
  const stopHere = new Date();

  stopHere.setMonth(stopHere.getMonth() - months);

  if (checkVariants) {
    items = addVariants(channels, items);
  }

  if (items[0].includes('ctr') && items[0].includes('asi')) {
    reverse.pop();
    for (const item of items) {
      reverse.push(uvSwap(item))
    }
  }

  for (const channel of channels) {
    const messages = JSON.parse(fs.readFileSync(`src/data/tradelogs/${channel}.json`));
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
          .setTitle(`I found these posts in ${channel}:`)
          .setColor('#f9d49c');
        matches.push(foundIn);
      }

      const msg = tradelogEmbed()
        .setTitle(message.date)
        .setDescription(message.content);

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

  await searchFinished(interaction, logsFound, channels, items[0]);
};

const searchFinished = async (interaction, logsFound, channels, item) => {
  const message = buildEmbed()
    .setColor('#f9d49c')
    .setDescription('By default I only look at tradelogs from the past 3 months!\nIf you want me to look past that use the *months* option.\n\nIf you notice a problem please contact @ellilglor#6866!\nDid you know we have our own discord server?\n<https://discord.gg/nGW89SHHj3>');

  if (logsFound) {
    message.setTitle(`I couldn't find anything else for __${item}__, hope these helped!`);
  } else { 
    message.setTitle(`I couldn't find any listings for __${item}__.`); 
  }

  if (channels.includes('equipment')) {
    for (const equipment of spreadsheet) {
      if (item.includes(equipment)) {
        message.addField('** **', `__${item}__ can be found on the merchant sheet:\n https://docs.google.com/spreadsheets/d/1h-SoyMn3kVla27PRW_kQQO6WefXPmLZYy7lPGNUNW7M/htmlview#`, false);
      }
    }
  }

  //console.log(`finished /search ${item} for ${interaction.user.tag}`);
  await interaction.user.send({embeds: [message]});
};

const addVariants = (channels, items) => {
  if (channels.includes('equipment')) {
    itemFamilyLoop:
    for (const family in equipmentFamilies) {
      for (const name of equipmentFamilies[family]) {
        if (!items[0].includes(name)) { continue; }
      
        const uvs = ' ' + items[0].replace(name, '').trim();
        items.pop();
        for (const item of equipmentFamilies[family]) {
          items.push(`${item}${uvs}`.trim());
        }
        break itemFamilyLoop;
      }
    }
  } else {
    colorLoop:
    for (const set in colorSets) {
      for (const name of colorSets[set]) {
        if (!items[0].includes(name)) { continue; }

        if (set.includes('gems')) {
          if (items[0].includes('bout') || items[0].includes('rose') || items[0].includes('tabard') || items[0].includes('chapeau')) {
            continue;
          }
        }
      
        const template = items[0].replace(name, '').trim();

        if (name.includes('rose')) {
          if (roses.includes(template)) {
            continue;
          }
        }

        items.pop();
        for (const color of colorSets[set]) {
          items.push(`${color} ${template}`);
        }
        break colorLoop;
      }
    }
  }

  return items;
}
const contentFilter = (content) => {
	result = content.replace(/['"\+\[\]()\-{},]/g, "").toLowerCase();

	if (result.includes('gm')) {
		result = result.replace('gm', '').concat(' ', 'asi vh ctr vh');
	}

	result = result
		.replace("  ", " ")
		.replace("mixer", "overcharged mixmaster")
		.replace(/vh/g, "very high")
		.replace("bkc", "black kat cowl")
		.replace("bkr", "black kat raiment")
		.replace("bkm", "black kat mail")
		.trim();

	return result;
};

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
  findChannels,
  searchLogs,
  contentFilter
};