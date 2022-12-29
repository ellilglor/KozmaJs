const { buildEmbed } = require('@functions/general');
const { getCommands, getSearched, getBoxes } = require('@functions/database/stats');
const { getGamblers } = require('@functions/database/punch');
const { getUsers } = require('@functions/database/user');
const { channels } = require('@structures/findlogs');
const { version } = require('@root/package.json');
const { globals } = require('@data/variables');
const fs = require('fs');

const buildStats = async (interaction, embeds, defer) => {
  const client = interaction.client;
  const items = await getSearched();
  const users = await getUsers();

  const serverStats = await buildServerStats(interaction, client);
  const commandStats = await buildCommandStats(interaction);
  const userStats = buildUserStats(interaction, users, commandStats.noGames);
  const unboxStats = await buildUnboxStats(interaction);
  const unboxerStats = buildUnboxerStats(interaction, users, unboxStats.total);
  const punchStats = await buildPunchStats(interaction);
  const logStats = buildLogStats(interaction);
  const authorStats = buildAuthorStats(interaction, logStats.total);
  const searchStats = buildSearchStats(interaction, items);

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
    { name: 'Unique bot users:', value: users.length.toLocaleString('en'), inline: true },
    { name: 'Total servers:', value: client.guilds.cache.size.toLocaleString('en'), inline: true },
    { name: 'Available unique users:', value: serverStats.total.toLocaleString('en'), inline: true },
    { name: 'Commands used:', value: commandStats.total.toLocaleString('en'), inline: true },
    { name: 'Amount of tradelogs:', value: logStats.total.toLocaleString('en'), inline: true },
    { name: 'Items searched:', value: items.length.toLocaleString('en'), inline: true },
    { name: 'Server members:', value: guild.memberCount.toLocaleString('en'), inline: true }
  ]);

  embeds.push(
    info,
    serverStats.embed,
    commandStats.embed,
    userStats.embed,
    unboxStats.embed,
    unboxerStats.embed,
    punchStats.embed,
    logStats.embed,
    authorStats.embed,
    searchStats.embed
  )

  return embeds;
}

const buildServerStats = async (interaction, client) => {
  const embed = buildEmbed(interaction).setTitle('I am in these servers:');
  const servers = client.guilds.cache.map(g => { return { name: g.name, members: g.memberCount } });
  servers.sort((a, b) => { return b.members - a.members });
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

const buildCommandStats = async (interaction) => {
  const embed = buildEmbed(interaction).setTitle('How much each command has been used:');
  const commands = await getCommands();
  const sum = commands.reduce((total, cmd) => cmd.amount + total, 0);
  const unbox = commands.find((c) => c.command == 'unbox'), punch = commands.find((c) => c.command == 'punch');
  const withoutGames = sum - unbox.amount - punch.amount;
  let names = '', amounts = '', percentages = '';

  for (const [index, cmd] of commands.entries()) {
    const perc = ((cmd.amount / sum) * 100).toFixed(2);

    names = names.concat('', `**${index + 1}. ${cmd.command}**\n`);
    amounts = amounts.concat('', `${cmd.amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${perc}%\n`);
  }

  embed.addFields([
    { name: 'Command:', value: names, inline: true },
    { name: 'Used:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total amount:', value: sum.toLocaleString('en'), inline: true },
    { name: 'Total without games:', value: withoutGames.toLocaleString('en'), inline: true }
  ]);

  return { embed: embed, total: sum, noGames: withoutGames };
}

const buildUserStats = (interaction, users, usage) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 bot users:');
  let tags = '', commands = '', percentages = '';

  users.every((user, index) => {
    const perc = ((user.amount / usage) * 100).toFixed(2);
    
    tags = tags.concat('', `**${index + 1}. ${user.tag}**\n`);
    commands = commands.concat('', `${user.amount}\n`);
    percentages = percentages.concat('', `${perc}%\n`);
    return index > 18 ? false : true;
  });
  
  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Commands:', value: commands, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Unique users:', value: users.length.toLocaleString('en'), inline: true },
    { name: 'Bot usage:', value: usage.toLocaleString('en'), inline: true }
  ]);

  return { embed: embed };
}

const buildUnboxStats = async (interaction) => {
  const embed = buildEmbed(interaction).setTitle('How much each box has been opened:');
  const boxes = await getBoxes();
  const sum = boxes.reduce((total, box) => box.amount + total, 0);
  let names = '', amounts = '', percentages = '';

  for (const [index, box] of boxes.entries()) {
    const perc = ((box.amount / sum) * 100).toFixed(2);

    names = names.concat('', `**${index + 1}. ${box.box}**\n`);
    amounts = amounts.concat('', `${box.amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${perc}%\n`);
  }

  embed.addFields([
    { name: 'Box:', value: names, inline: true },
    { name: 'Opened:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total opened:', value: sum.toLocaleString('en') }
  ]);

  return { embed: embed, total: sum };
}

const buildUnboxerStats = (interaction, users, total) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 unboxers:');
  let tags = '', amounts = '', percentages = '';
  users.sort((a, b) => { return b.unboxed - a.unboxed });

  users.every((user, index) => {
    const perc = ((user.unboxed / total) * 100).toFixed(2);
    
    tags = tags.concat('', `**${index + 1}. ${user.tag}**\n`);
    amounts = amounts.concat('', `${user.unboxed}\n`);
    percentages = percentages.concat('', `${perc}%\n`);
    return index > 18 ? false : true;
  });

  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Opened:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total opened:', value: total.toLocaleString('en') }
  ]);

  return { embed: embed };
}

const buildPunchStats = async (interaction) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 highest spenders at Punch:');
  const gamblers = await getGamblers();
  const sum = gamblers.reduce((total, g) => g.total + total, 0);
  let tags = '', spent = '', percentages = '';

  gamblers.every((g, index) => {
    const perc = ((g.total / sum) * 100).toFixed(2);
    
    tags = tags.concat('', `**${index + 1}. ${g.tag}**\n`);
    spent = spent.concat('', `${g.total.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${perc}%\n`);
    return index > 18 ? false : true;
  });

  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Crowns spent:', value: spent, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total amount spent:', value: sum.toLocaleString('en') }
  ]);

  return { embed: embed };
}

const buildLogStats = (interaction) => {
  const embed = buildEmbed(interaction).setTitle('These are the amount of tradelogs:');
  const channels = JSON.parse(fs.readFileSync('src/data/tradelogs/tradelogs.json'));
  channels.sort((a, b) => { return b.amount - a.amount });
  const sum = channels.reduce((total, chnl) => chnl.amount + total, 0);
  let names = '', amounts = '', percentages = '';

  for (const [index, chnl] of channels.entries()) {
    const perc = ((chnl.amount / sum) * 100).toFixed(2);

    names = names.concat('', `**${index + 1}. ${chnl.name}**\n`);
    amounts = amounts.concat('', `${chnl.amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${perc}%\n`);
  }

  embed.addFields([
    { name: 'Channel:', value: names, inline: true },
    { name: 'Posts:', value: amounts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total amount:', value: sum.toLocaleString('en') }
  ]);

  return { embed: embed, total: sum };
}

const buildAuthorStats = (interaction, totalLogs) => {
  const embed = buildEmbed(interaction).setTitle('These are all loggers:');
  const authors = {};
  let tags = '', posts = '', percentages = '';

  for (const [name, id] of channels) {
    const logs = JSON.parse(fs.readFileSync(`src/data/tradelogs/${name}.json`));

    for (const message of logs) {
      authors[message.author] = authors[message.author] + 1 || 1;
    }
  }
  
  const sortable = Object.entries(authors);
  sortable.sort((a, b) => { return b[1] - a[1] });

  for (const [index, [author, amount]] of sortable.entries()) {
    const perc = ((amount / totalLogs) * 100).toFixed(2);
    
    tags = tags.concat('', `**${index + 1}. ${author.replace('#supply-depot', '')}**\n`);
    posts = posts.concat('', `${amount.toLocaleString('en')}\n`);
    percentages = percentages.concat('', `${perc}%\n`);
  }

  embed.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Messages:', value: posts, inline: true },
    { name: 'Percentage:', value: percentages, inline: true },
    { name: 'Total amount:', value: totalLogs.toLocaleString('en') }
  ]);

  return { embed: embed };
}

const buildSearchStats = (interaction, items) => {
  const embed = buildEmbed(interaction).setTitle('Top 20 searched items:');
  let names = '', amounts = '';

  items.every((item, index) => {
    names = names.concat('', `**${index + 1}. ${item.item}**\n`);
    amounts = amounts.concat('', `${item.amount.toLocaleString('en')}\n`);
    return index > 18 ? false : true;
  });
  
  embed.addFields([
    { name: 'Item:', value: names, inline: true },
    { name: 'Searches:', value: amounts, inline: true },
    { name: 'Items searched:', value: items.length.toLocaleString('en') }
  ]);

  return { embed: embed };
}

module.exports = {
  buildStats
}