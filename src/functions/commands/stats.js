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
  let userCount = 0, userDesc = '**Discord tag | Commands used | Boxes opened**\n';

  users.every(u => {
    userCount += 1;
    userDesc = userDesc.concat('',`**${userCount}. ${u.tag}** | ${u.amount} | ${u.unboxed}\n`);
    return userCount > 19 ? false : true;
  });
  
  userDesc = userDesc.concat('',`\nTotal amount of users: ${users.length}`);
  userStats.setDescription(userDesc);
  embeds.push(userStats);
  
  //Servers the bot is in
  const servers = buildEmbed().setTitle('I am in these servers:');
  const serverArray = [];
  let serversDesc = '';
  
  client.guilds.cache.forEach(g => serverArray.push({ name: g.name, members: g.memberCount }));
  serverArray.sort((a, b) => { return b.members - a.members });
  serverArray.forEach(s => serversDesc = serversDesc.concat('', `**${s.name}** | ${s.members} members\n`));
  
  serversDesc = serversDesc.concat('', `\nTotal amount: ${client.guilds.cache.size}`);
  servers.setDescription(serversDesc);
  embeds.push(servers);

  //Command usage
  const commandStats = buildEmbed().setTitle('How much each command has been used:');
  const commands = await getCommands();
  const commandSum = commands.reduce((total, cmd) => cmd.amount + total, 0);
  let commandDesc = '';

  commands.forEach(cmd => commandDesc = commandDesc.concat('', `**${cmd.command}** | ${cmd.amount}\n`));
  
  commandDesc = commandDesc.concat('', `\nTotal amount: ${commandSum}`);
  commandStats.setDescription(commandDesc);
  embeds.push(commandStats);

  //unbox command stats
  const unboxStats = buildEmbed().setTitle('How much each box has been opened:');
  const boxes = await getBoxes();
  const unboxSum = boxes.reduce((total, box) => box.amount + total, 0);
  let unboxDesc = '';

  boxes.forEach(box => unboxDesc = unboxDesc.concat('', `**${box.box}** | ${box.amount}\n`));
  
  unboxDesc = unboxDesc.concat('', `\nTotal opened: ${unboxSum}`);
  unboxStats.setDescription(unboxDesc);
  embeds.push(unboxStats);

  //Amount of tradelogs
  const logStats = buildEmbed().setTitle('These are the amount of tradelogs:');
  const channels = JSON.parse(fs.readFileSync(`src/data/tradelogs/tradelogs.json`));
  const logSum = channels.reduce((total, chnl) => chnl.amount + total, 0);
  let logsDesc = '';

  channels.forEach(chnl => logsDesc = logsDesc.concat('', `**${chnl.name}** | ${chnl.amount}\n`));
  
  logsDesc = logsDesc.concat('', `\nTotal amount: ${logSum}`);
  logStats.setDescription(logsDesc);
  embeds.push(logStats);

  //findlogs command stats
  const searchStats = buildEmbed().setTitle('Top 20 searched items:');
  const items = await getSearched();
  let itemCount = 0, searchDesc = '';

  items.every(item => {
    itemCount += 1;
    searchDesc = searchDesc.concat('', `**${itemCount}. ${item.item}** | ${item.amount}\n`);
    return itemCount > 19 ? false : true;
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
    { name: 'Unique users:', value: users.length.toString(), inline: true },
    { name: 'Total servers:', value: client.guilds.cache.size.toString(), inline: true },
    { name: 'Commands used:', value: commandSum.toString(), inline: true },
    { name: 'Server members:', value: guild.memberCount.toString(), inline: true },
    { name: 'Amount of tradelogs:', value: logSum.toString(), inline: true },
    { name: '\u200B', value: '\u200B', inline: true }
  ]);

  embeds.unshift(info)

  return embeds;
}

module.exports = {
  buildStats
}