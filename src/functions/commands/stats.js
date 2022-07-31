const { buildEmbed } = require('@functions/general');
const { getCommands, getSearched, getBoxes } = require('@functions/database/stats');
const { getUsers } = require('@functions/database/user');
const { version } = require('@root/package.json');
const { globals } = require('@data/variables');
const fs = require('fs');

const buildStats = async ({ client, createdTimestamp }, embeds, defer) => {
  //bot usage
  const userStats = buildEmbed().setTitle('Top 20 bot users:');
  const users = await getUsers();
  let tags = '', used = '', gambled = '';

  users.every((u, index) => {
    tags = tags.concat('', `**${index + 1}. ${u.tag}**\n`);
    used = used.concat('', `${u.amount}\n`);
    gambled = gambled.concat('', `${u.unboxed}\n`);
    return index > 18 ? false : true;
  });
  
  userStats.addFields([
    { name: 'Discord tag:', value: tags, inline: true },
    { name: 'Commands used:', value: used, inline: true },
    { name: 'Boxes opened:', value: gambled, inline: true },
    { name: 'Total amount of users:', value: users.length.toString() }
  ]);
  embeds.push(userStats);
  
  //Servers the bot is in
  const serverStats = buildEmbed().setTitle('I am in these servers:');
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
  const commandStats = buildEmbed().setTitle('How much each command has been used:');
  const commands = await getCommands();
  const commandSum = commands.reduce((total, cmd) => cmd.amount + total, 0);
  const commandDesc = commands.reduce((desc, c) => desc.concat('', `**${c.command}** - ${c.amount}\n`), '');
  
  commandStats.addFields([{ name: 'Total used:', value: commandSum.toString() }]);
  commandStats.setDescription(commandDesc);
  embeds.push(commandStats);

  //unbox command stats
  const unboxStats = buildEmbed().setTitle('How much each box has been opened:');
  const boxes = await getBoxes();
  const unboxSum = boxes.reduce((total, box) => box.amount + total, 0);
  const unboxDesc = boxes.reduce((desc, box) => desc.concat('', `**${box.box}** - ${box.amount}\n`), '');
  
  unboxStats.addFields([{ name: 'Total opened:', value: unboxSum.toString() }]);
  unboxStats.setDescription(unboxDesc);
  embeds.push(unboxStats);

  //Amount of tradelogs
  const logStats = buildEmbed().setTitle('These are the amount of tradelogs:');
  const channels = JSON.parse(fs.readFileSync(`src/data/tradelogs/tradelogs.json`));
  const logSum = channels.reduce((total, chnl) => chnl.amount + total, 0);
  const logsDesc = channels.reduce((desc, c) => desc.concat('', `**${c.name}** - ${c.amount}\n`), '');

  logStats.addFields([{ name: 'Total amount:', value: logSum.toString() }]);
  logStats.setDescription(logsDesc);
  embeds.push(logStats);

  //findlogs command stats
  const searchStats = buildEmbed().setTitle('Top 20 searched items:');
  const items = await getSearched();
  let searchDesc = '';

  items.every((item, index) => {
    searchDesc = searchDesc.concat('', `**${index + 1}. ${item.item}** - ${item.amount}\n`);
    return index > 18 ? false : true;
  });
  
  searchStats.setDescription(searchDesc);
  embeds.push(searchStats);

  //general info
  const info = buildEmbed().setTitle(`General info about ${client.user.username}:`);
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