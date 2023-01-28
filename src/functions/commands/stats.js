const { buildEmbed } = require('@functions/general');
const db = require('@functions/database/getStats');
const { calculateCost } = require('@functions/commands/unbox');
const { boxes } = require('@structures/unbox');
const { version } = require('@root/package.json');
const { globals } = require('@data/variables');

const buildStats = async (interaction, embeds, defer) => {
  const client = interaction.client;
  const logCount = await db.getTotalLogs();
  const unboxStats = await db.getUnboxStats();
  const findlogStats = await db.getFindlogStats();
  const commandStats = await db.getCommandStats();
  const punchStats = await db.getPunchStats();
  const userStats = await db.getUserStats(commandStats[0].total, unboxStats.total);

  const punchSessions = commandStats[1].total - unboxStats.total;

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

  const info = buildEmbed(interaction).setTitle(`General info about ${client.user.username}:`);
  const guild = await client.guilds.fetch(globals.serverId);
  const latency = defer.createdTimestamp - interaction.createdTimestamp;
  const timestamp = Math.round(client.readyTimestamp/1000);

  info.addFields([
    { name: 'Bot tag:', value: client.user.tag, inline: true },
    { name: 'Bot id:', value: client.user.id, inline: true },
    { name: 'Version:', value: version, inline: true },
    { name: 'Running since:', value: `<t:${timestamp}:f>`, inline: true },
    { name: 'Websocket heartbeat:', value: `${client.ws.ping}ms`, inline: true },
    { name: 'Roundtrip latency:', value: `${latency}ms`, inline: true },
    { name: 'Unique bot users:', value: userStats.total.toLocaleString('en'), inline: true },
    { name: 'Total servers:', value: client.guilds.cache.size.toLocaleString('en'), inline: true },
    { name: 'Available unique users:', value: serverStats.total.toLocaleString('en'), inline: true },
    { name: 'Commands used:', value: commandStats[0].total.toLocaleString('en'), inline: true },
    { name: 'Amount of tradelogs:', value: logCount.toLocaleString('en'), inline: true },
    { name: 'Items searched:', value: findlogStats.totalSearched.toLocaleString('en'), inline: true },
    { name: 'Server members:', value: guild.memberCount.toLocaleString('en'), inline: true }
  ]);

  embeds.push(
    info,
    serverStats.embed,
    commandEmbed,
    gameEmbed,
    userEmbed,
    unboxEmbed,
    unboxerEmbed,
    punchEmbed,
    logChannelEmbed,
    logAuthorEmbed,
    findlogEmbed
  )

  return embeds;
}

const buildServerStats = async (interaction, client) => {
  const embed = buildEmbed(interaction).setTitle('I am in these servers:');
  const servers = client.guilds.cache.map(g => { return { name: g.name, members: g.memberCount } });
  servers.sort((a, b) => b.members - a.members);
  const members = {};
  let field1 = '', field2 = '';

  for (const [id, guild] of client.guilds.cache) {
    await guild.members.fetch();

    for (const [id, member] of guild.members.cache) {
      if (member.user.bot) continue;
      if (members[id]) continue;
      members[id] = null;
    }
  }

  const uniqueMembers = Object.keys(members).length;

  servers.forEach((server, index) => {
    if (index % 2 === 0) {
      field1 = field1.concat('', `**${index + 1}. ${server.name}** - ${server.members}\n`);
    } else {
      field2 = field2.concat('', `**${index + 1}. ${server.name}** - ${server.members}\n`);
    }
  });
  
  embed.addFields([
    { name: '\u200B', value: field1, inline: true },
    { name: '\u200B', value: field2, inline: true },
    { name: '\u200B', value: '\u200B', inline: true },
    { name: 'Total amount of servers:', value: client.guilds.cache.size.toLocaleString('en'), inline: true },
    { name: 'Unique available users:', value: uniqueMembers.toLocaleString('en'), inline: true }
  ]);

  return { embed: embed, total: uniqueMembers };
}

const buildCommandEmbed = (interaction, stats) => {
  const title = stats._id === false ? 'Command usage:' : 'Games played:';
  const embed = buildEmbed(interaction).setTitle(title);
  let names = '', amounts = '', percentages = '';

  stats.commands.forEach((command, index) => {
    names = names.concat('', `**${index + 1}. ${command.command}**\n`);
    amounts = amounts.concat('', `${command.amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${command.percentage}%\n`);
  });

  embed.addFields([
    { name: 'Command:', value: names, inline: true },
    { name: 'Used:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total:', value: stats.total.toLocaleString('en'), inline: true },
  ]);

  return embed;
}

const buildUserEmbed = (interaction, stats, total) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 bot users:');
  let tags = '', commands = '', percentages = '';

  stats.users.forEach((user, index) => {
    tags = tags.concat('', `**${index + 1}. ${user.tag}**\n`);
    commands = commands.concat('', `${user.amount}\n`);
    percentages = percentages.concat('', `${user.percentage}%\n`);
  })
  
  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Commands:', value: commands, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Unique users:', value: stats.total.toLocaleString('en'), inline: true },
    { name: 'Bot usage:', value: total.toLocaleString('en'), inline: true }
  ]);

  return embed;
}

const buildUnboxEmbed = (interaction, stats) => {
  const embed = buildEmbed(interaction).setTitle('How much each box has been opened:');
  let names = '', amounts = '', percentages = '', energy = 0, dollars = 0;

  stats.boxes.forEach((box, index) => {
    const boxData = boxes.get(box.box);

    if (boxData.currency === '$') {
      dollars += parseFloat(calculateCost(box.amount));
    } else {
      energy += box.amount * boxData.price;
    }

    names = names.concat('', `**${index + 1}. ${box.box}**\n`);
    amounts = amounts.concat('', `${box.amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${box.percentage}%\n`);
  });

  embed.addFields([
    { name: 'Box:', value: names, inline: true },
    { name: 'Opened:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total opened:', value: stats.total.toLocaleString('en'), inline: true },
    { name: 'Energy spent:', value: energy.toLocaleString('en'), inline: true },
    { name: 'Dollars spent:', value: `$${dollars.toLocaleString('en')}`, inline: true }
  ]);

  return embed;
}

const buildUnboxerEmbed = (interaction, stats, total) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 unboxers:');
  let tags = '', amounts = '', percentages = '';

  stats.unboxers.forEach((user, index) => {
    tags = tags.concat('', `**${index + 1}. ${user.tag}**\n`);
    amounts = amounts.concat('', `${user.unboxed}\n`);
    percentages = percentages.concat('', `${user.percentage}%\n`);
  });

  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Opened:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total opened:', value: total.toLocaleString('en') }
  ]);

  return embed;
}

const buildPunchEmbed = (interaction, stats, sessions) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 highest spenders at Punch:');
  let tags = '', spent = '', percentages = '';

  stats.gamblers.forEach((gambler, index) => {
    tags = tags.concat('', `**${index + 1}. ${gambler.tag}**\n`);
    spent = spent.concat('', `${gambler.total.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${gambler.percentage}%\n`);
  });

  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Crowns spent:', value: spent, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total amount spent:', value: stats.total.toLocaleString('en'), inline: true },
    { name: 'Sessions:', value: sessions.toLocaleString('en'), inline: true }
  ]);

  return embed;
}

const buildTradelogEmbed = async (interaction, type, total) => {
  const title = type === '$author' ? 'All loggers:' : 'Amount of tradelogs:';
  const fieldName = type === '$author' ? 'Discord tag:' : 'Channel:';
  const embed = buildEmbed(interaction).setTitle(title);
  const stats = await db.getLogStats(type, total);
  let field1 = '', posts = '', percentages = '';

  stats.forEach((stat, index) => {
    field1 = field1.concat('', `**${index + 1}. ${stat._id.replace(' #supply-depot', '')}**\n`);
    posts = posts.concat('', `${stat.amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${stat.percentage}%\n`);
  });

  embed.addFields([
    { name: fieldName, value: field1, inline: true },
    { name: 'posts:', value: posts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total:', value: total.toLocaleString('en') }
  ]);

  return embed;
}

const buildFindlogEmbed = (interaction, stats) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 searched items:');
  let names = '', amounts = '';

  stats.searches.forEach((item, index) => {
    names = names.concat('', `**${index + 1}. ${item.item}**\n`);
    amounts = amounts.concat('', `${item.amount.toLocaleString('en')}\n`);
  });
  
  embed.addFields([
    { name: 'Item:', value: names, inline: true },
    { name: 'Searches:', value: amounts, inline: true },
    { name: 'Items searched:', value: stats.totalSearched.toLocaleString('en') }
  ]);

  return embed;
}

module.exports = {
  buildStats
}