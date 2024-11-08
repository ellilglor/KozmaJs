const { buildEmbed } = require('@utils/functions');
const dbRepo = require('@database/repos/dbRepo');
const { statTypes } = require('@database/repos/types');
const { calculateCost } = require('@commands/games/unbox/functions/unbox');
const { boxes } = require('@commands/games/unbox/data/boxData');
const { version } = require('@root/package.json');
const { globals } = require('@utils/variables');

const buildStats = async (interaction, embeds, defer) => {
  const client = interaction.client;
  const guild = await client.guilds.fetch(globals.serverId);
  const logCount = await dbRepo.getStats(statTypes.logCount);
  const unboxStats = await dbRepo.getStats(statTypes.box);
  const findlogStats = await dbRepo.getStats(statTypes.searched);
  const commandStats = await dbRepo.getStats(statTypes.command);
  const punchStats = await dbRepo.getStats(statTypes.gambler);
  const userStats = await dbRepo.getStats(statTypes.user, commandStats[0].total, unboxStats.total);

  const punchSessions = commandStats[1].total - unboxStats.total;

  const info = buildEmbed(interaction).setTitle('General info');
  const serverStats = await buildServerStats(interaction, client);
  const commandEmbed = buildCommandEmbed(interaction, commandStats[0]);
  const gameEmbed = buildCommandEmbed(interaction, commandStats[1]);
  const userEmbed = buildUserEmbed(interaction, userStats, commandStats[0].total);
  const unboxEmbed = buildUnboxEmbed(interaction, unboxStats);
  const unboxerEmbed = buildUnboxerEmbed(interaction, userStats, unboxStats.total);
  const punchEmbed = buildPunchEmbed(interaction, punchStats, punchSessions);
  const logChannelEmbed = await buildTradelogEmbed(interaction, '$author', logCount);
  const logAuthorEmbed = await buildTradelogEmbed(interaction, '$channel', logCount);
  const findlogEmbed = buildFindlogEmbed(interaction, findlogStats);

  info.addFields([
    { name: 'Bot tag:', value: client.user.tag, inline: true },
    { name: 'Bot id:', value: client.user.id, inline: true },
    { name: 'Version:', value: version, inline: true },
    { name: 'Running since:', value: `<t:${Math.round(client.readyTimestamp/1000)}:f>`, inline: true },
    { name: 'Websocket heartbeat:', value: `${client.ws.ping}ms`, inline: true },
    { name: 'Roundtrip latency:', value: `${defer.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
    { name: 'Unique bot users:', value: userStats.total.toLocaleString('en'), inline: true },
    { name: 'Total servers:', value: client.guilds.cache.size.toLocaleString('en'), inline: true },
    { name: 'Unique available users:', value: serverStats.total.toLocaleString('en'), inline: true },
    { name: 'Commands used:', value: commandStats[0].total.toLocaleString('en'), inline: true },
    { name: 'Tradelogs:', value: logCount.toLocaleString('en'), inline: true },
    { name: 'Items searched:', value: findlogStats.totalSearched.toLocaleString('en'), inline: true },
    { name: 'Server members:', value: guild.memberCount.toLocaleString('en'), inline: true }
  ]);

  embeds.push(
    info,
    ...serverStats.embeds,
    commandEmbed,
    gameEmbed,
    userEmbed,
    unboxEmbed,
    unboxerEmbed,
    punchEmbed,
    logChannelEmbed,
    logAuthorEmbed,
    findlogEmbed
  );

  embeds.forEach((embed, id) => {
    embed.setTitle(`${embed.data.title} - ${id + 1}/${embeds.length}`);
  })

  return embeds;
}

const buildServerStats = async (interaction, client) => {
  const embeds = [];
  const members = {};

  for (const [id, guild] of client.guilds.cache) {
    await guild.members.fetch();

    for (const [id, member] of guild.members.cache) {
      if (member.user.bot) continue;
      if (members[id]) continue;
      members[id] = 1;
    }
  }

  const uniqueMembers = Object.keys(members).length;

  const serverPages = Array.from(client.guilds.cache.values())
    .sort((a, b) => b.memberCount - a.memberCount)
    .map((server, index) => `${index + 1}. **${server.name}**: ${server.memberCount}`)
    .reduce((pages, info, index) => {
        const pageIndex = Math.floor(index / 20);
        if (!pages[pageIndex]) {
            pages[pageIndex] = [];
        }
        pages[pageIndex].push(info);
        return pages;
    }, [])
    .map(page => page.join("\n"));

    for (let i = 0; i < serverPages.length; i += 2) {
      const embed = buildEmbed(interaction).setTitle('Servers');
      embed.addFields([
        { name: '\u200B', value: serverPages[i], inline: true },
        { name: '\u200B', value: i + 1 < serverPages.length ? serverPages[i + 1] : '\u200B', inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Total:', value: client.guilds.cache.size.toLocaleString('en'), inline: true },
        { name: 'Unique available users:', value: uniqueMembers.toLocaleString('en'), inline: true }
      ]);

      embeds.push(embed);
    }

  return { embeds: embeds, total: uniqueMembers };
}

const buildCommandEmbed = (interaction, stats) => {
  const title = stats._id === false ? 'Command usage' : 'Games played';
  const fieldName = stats._id === false ? 'Command:' : 'Game:';
  const embed = buildEmbed(interaction).setTitle(title);
  let names = '', amounts = '', percentages = '';

  stats.commands.forEach((command, index) => {
    names = names.concat('', `${index + 1} **${command.command}**\n`);
    amounts = amounts.concat('', `${command.amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${command.percentage.toFixed(2)}%\n`);
  });

  embed.addFields([
    { name: fieldName, value: names, inline: true },
    { name: 'Used:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total:', value: stats.total.toLocaleString('en'), inline: true },
  ]);

  return embed;
}

const buildUserEmbed = (interaction, stats, total) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 bot users');
  let tags = '', commands = '', percentages = '';

  stats.users.forEach((user, index) => {
    tags = tags.concat('', `${index + 1} **${user.tag}**\n`);
    commands = commands.concat('', `${user.amount}\n`);
    percentages = percentages.concat('', `${user.percentage.toFixed(2)}%\n`);
  })
  
  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Commands:', value: commands, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Unique users:', value: stats.total.toLocaleString('en'), inline: true },
    { name: 'Commands:', value: total.toLocaleString('en'), inline: true }
  ]);

  return embed;
}

const buildUnboxEmbed = (interaction, stats) => {
  const embed = buildEmbed(interaction).setTitle('Unbox command');
  let names = '', amounts = '', percentages = '', energy = 0, dollars = 0;

  stats.boxes.forEach((box, index) => {
    const boxData = boxes.get(box.box);

    if (boxData.currency === '$') {
      dollars += parseFloat(calculateCost(box.amount));
    } else {
      energy += box.amount * boxData.price;
    }

    names = names.concat('', `${index + 1} **${box.box}**\n`);
    amounts = amounts.concat('', `${box.amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${box.percentage.toFixed(2)}%\n`);
  });

  embed.addFields([
    { name: 'Box:', value: names, inline: true },
    { name: 'Opened:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total:', value: stats.total.toLocaleString('en'), inline: true },
    { name: 'Energy spent:', value: energy.toLocaleString('en'), inline: true },
    { name: 'Dollars spent:', value: `$${dollars.toLocaleString('en')}`, inline: true }
  ]);

  return embed;
}

const buildUnboxerEmbed = (interaction, stats, total) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 unboxers');
  let tags = '', amounts = '', percentages = '';

  stats.unboxers.forEach((user, index) => {
    tags = tags.concat('', `${index + 1} **${user.tag}**\n`);
    amounts = amounts.concat('', `${user.unboxed}\n`);
    percentages = percentages.concat('', `${user.percentage.toFixed(2)}%\n`);
  });

  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Opened:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total:', value: total.toLocaleString('en') }
  ]);

  return embed;
}

const buildPunchEmbed = (interaction, stats, sessions) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 highest spenders at Punch');
  let tags = '', spent = '', percentages = '';

  stats.gamblers.forEach((gambler, index) => {
    tags = tags.concat('', `${index + 1} **${gambler.tag}**\n`);
    spent = spent.concat('', `${gambler.total.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${gambler.percentage.toFixed(2)}%\n`);
  });

  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Crowns spent:', value: spent, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total spent:', value: stats.total.toLocaleString('en'), inline: true },
    { name: 'Sessions:', value: sessions.toLocaleString('en'), inline: true }
  ]);

  return embed;
}

const buildTradelogEmbed = async (interaction, type, total) => {
  const title = type === '$author' ? 'All loggers' : 'Tradelog channels';
  const fieldName = type === '$author' ? 'Discord tag:' : 'Channel:';
  const embed = buildEmbed(interaction).setTitle(title);
  const stats = await dbRepo.getStats(statTypes.logStats, type, total);
  let field1 = '', posts = '', percentages = '';

  stats.forEach((stat, index) => {
    field1 = field1.concat('', `${index + 1} **${stat._id}**\n`);
    posts = posts.concat('', `${stat.amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${stat.percentage.toFixed(2)}%\n`);
  });

  embed.addFields([
    { name: fieldName, value: field1, inline: true },
    { name: 'Posts:', value: posts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total:', value: total.toLocaleString('en') }
  ]);

  return embed;
}

const buildFindlogEmbed = (interaction, stats) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 searched items');
  let names = '', amounts = '';

  stats.searches.forEach((item, index) => {
    names = names.concat('', `${index + 1} **${item.item}**\n`);
    amounts = amounts.concat('', `${item.amount.toLocaleString('en')}\n`);
  });
  
  embed.addFields([
    { name: 'Item:', value: names, inline: true },
    { name: 'Searches:', value: amounts, inline: true },
    { name: 'Unique searches:', value: stats.totalSearched.toLocaleString('en') }
  ]);

  return embed;
}

module.exports = {
  buildStats
}