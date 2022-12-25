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
  const createdTimestamp = interaction.createdTimestamp
  
  //bot usage
  const userStats = buildEmbed(interaction).setTitle('Top 20 bot users:');
  const users = await getUsers();
  let utags = '', used = '', opened = '';

  users.every((u, index) => {
    utags = utags.concat('', `**${index + 1}. ${u.tag}**\n`);
    used = used.concat('', `${u.amount}\n`);
    opened = opened.concat('', `${u.unboxed}\n`);
    return index > 18 ? false : true;
  });
  
  userStats.addFields([
    { name: 'Discord tag:', value: utags, inline: true },
    { name: 'Commands used:', value: used, inline: true },
    { name: 'Boxes opened:', value: opened, inline: true },
    { name: 'Total amount of users:', value: users.length.toString() }
  ]);
  embeds.push(userStats);
  
  //Servers the bot is in
  const serverStats = buildEmbed(interaction).setTitle('I am in these servers:');
  const servers = client.guilds.cache.map(g => { return { name: g.name, members: g.memberCount } });
  servers.sort((a, b) => { return b.members - a.members });
  let serverField1 = '', serverField2 = '', totalMembers = 0;

  servers.forEach((s, ind) => {
    const nr = ind + 1;
    if (ind % 2 === 0) {
      serverField1 = serverField1.concat('', `**${nr}. ${s.name}** - ${s.members}\n`);
    } else {
      serverField2 = serverField2.concat('', `**${nr}. ${s.name}** - ${s.members}\n`);
    }
    totalMembers += s.members;
  });
  
  serverStats.addFields([
    { name: '\u200B', value: serverField1, inline: true },
    { name: '\u200B', value: serverField2, inline: true },
    { name: '\u200B', value: '\u200B', inline: true },
    { name: 'Total amount of servers:', value: client.guilds.cache.size.toString(), inline: true },
    { name: 'Total available users:', value: totalMembers.toString(), inline: true }
  ]);
  embeds.push(serverStats);

  //Command usage
  const commandStats = buildEmbed(interaction).setTitle('How much each command has been used:');
  const commands = await getCommands();
  const commandSum = commands.reduce((total, cmd) => cmd.amount + total, 0);
  const commandDesc = commands.reduce((desc, c) => desc.concat('', `**${c.command}** - ${c.amount}\n`), '');
  
  commandStats.addFields([{ name: 'Total used:', value: commandSum.toString() }]);
  commandStats.setDescription(commandDesc);
  embeds.push(commandStats);

  //unbox command stats
  const unboxStats = buildEmbed(interaction).setTitle('How much each box has been opened:');
  const boxes = await getBoxes();
  const unboxSum = boxes.reduce((total, box) => box.amount + total, 0);
  const unboxDesc = boxes.reduce((desc, box) => desc.concat('', `**${box.box}** - ${box.amount}\n`), '');
  
  unboxStats.addFields([{ name: 'Total opened:', value: unboxSum.toString() }]);
  unboxStats.setDescription(unboxDesc);
  embeds.push(unboxStats);

  //punch command stats
  const punchStats = buildEmbed(interaction).setTitle('Top 20 highest spenders at Punch:');
  const gamblers = await getGamblers();
  const gamblerSum = gamblers.reduce((total, g) => g.total + total, 0).toLocaleString('en');
  let gtags = '', punched = '';

  gamblers.every((g, index) => {
    gtags = gtags.concat('', `**${index + 1}. ${g.tag}**\n`);
    punched = punched.concat('', `${g.total.toLocaleString('en')}\n`);
    return index > 18 ? false : true;
  });

  punchStats.addFields([
    { name: 'Discord tag:', value: gtags, inline: true },
    { name: 'Crowns spent:', value: punched, inline: true },
    { name: 'Total amount spent:', value: gamblerSum }
  ]);
  embeds.push(punchStats);

  //Amount of tradelogs
  const logStats = buildEmbed(interaction).setTitle('These are the amount of tradelogs:');
  const tradelogChannels = JSON.parse(fs.readFileSync(`src/data/tradelogs/tradelogs.json`));
  const logSum = tradelogChannels.reduce((total, chnl) => chnl.amount + total, 0);
  const logsDesc = tradelogChannels.reduce((desc, c) => desc.concat('', `**${c.name}** - ${c.amount}\n`), '');

  logStats.addFields([{ name: 'Total amount:', value: logSum.toString() }]);
  logStats.setDescription(logsDesc);
  embeds.push(logStats);

  //tradelog authors
  const authorStats = buildEmbed(interaction).setTitle('These are all loggers:');
  const authors = {};
  let authorNames = '', authorPosted = '', authorPerc = '', index = 1;

  for (const [name, id] of channels) {
    const logs = JSON.parse(fs.readFileSync(`src/data/tradelogs/${name}.json`));

    for (const message of logs) {
      authors[message.author] = authors[message.author] + 1 || 1;
    }
  }
  
  const authorsSortable = Object.entries(authors);
  authorsSortable.sort((a, b) => { return b[1] - a[1] });

  for (const [author, amount] of authorsSortable) {
    const perc = ((amount / logSum) * 100).toFixed(2);
    
    authorNames = authorNames.concat('', `**${index}. ${author}**\n`);
    authorPosted = authorPosted.concat('', `${amount.toLocaleString('en')}\n`);
    authorPerc = authorPerc.concat('', `${perc}%\n`);
    index++;
  }

  authorStats.addFields([
    { name: 'Discord tag:', value: authorNames, inline: true },
    { name: 'Messages:', value: authorPosted, inline: true },
    { name: 'Percentage:', value: authorPerc, inline: true },
    { name: 'Total amount:', value: logSum.toString() }
  ]);
  embeds.push(authorStats);
  
  //findlogs command stats
  const searchStats = buildEmbed(interaction).setTitle('Top 20 searched items:');
  const items = await getSearched();
  let searchDesc = '';

  items.every((item, index) => {
    searchDesc = searchDesc.concat('', `**${index + 1}. ${item.item}** - ${item.amount}\n`);
    return index > 18 ? false : true;
  });
  
  searchStats.setDescription(searchDesc);
  embeds.push(searchStats);

  //general info
  const info = buildEmbed(interaction).setTitle(`General info about ${client.user.username}:`);
  const guild = await client.guilds.fetch(globals.serverId);
  const latency = defer.createdTimestamp - createdTimestamp;
  const timestamp = Math.round(client.readyTimestamp/1000);

  info.addFields([
    { name: 'Bot tag:', value: client.user.tag, inline: true },
    { name: 'Bot id:', value: client.user.id, inline: true },
    { name: 'Version:', value: version, inline: true },
    { name: 'Running since:', value: `<t:${timestamp}:f>`, inline: true },
    { name: 'Websocket heartbeat:', value: `${client.ws.ping}ms`, inline: true },
    { name: 'Roundtrip latency:', value: `${latency}ms`, inline: true },
    { name: 'Unique bot users:', value: users.length.toString(), inline: true },
    { name: 'Total servers:', value: client.guilds.cache.size.toString(), inline: true },
    { name: 'Available users:', value: totalMembers.toString(), inline: true },
    { name: 'Commands used:', value: commandSum.toString(), inline: true },
    { name: 'Amount of tradelogs:', value: logSum.toString(), inline: true },
    { name: 'Items searched:', value: items.length.toString(), inline: true },
    { name: 'Server members:', value: guild.memberCount.toString(), inline: true }
  ]);

  embeds.unshift(info)

  return embeds;
}

module.exports = {
  buildStats
}