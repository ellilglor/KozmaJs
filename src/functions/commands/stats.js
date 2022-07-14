const { buildEmbed } = require('../../functions/general');
const { getCommands, getSearched, getBoxes } = require('../database/stats');
const { getUsers } = require('../database/user')
const fs = require('fs');

const buildStats = async (embeds, interaction) => {
  //bot usage
  const userStats = buildEmbed().setTitle('Top 20 bot users:');
  const users = await getUsers();
  let userCount = 0, userDesc = '**Discord tag | Commands used | Boxes opened**\n';
  
  for (const user of users) {
    userCount += 1;
    userDesc = userDesc.concat('',`**${userCount}. ${user.tag}** | ${user.amount} | ${user.unboxed}\n`);
    if (userCount > 19) break;
  }
  userDesc = userDesc.concat('',`\nTotal amount of users: ${users.length}`);
  userStats.setDescription(userDesc);
  embeds.push(userStats);
  
  //Servers the bot is in
  const servers = buildEmbed().setTitle('I am in these servers:');
  const serverArray = [];
  let serverSum = 0, serversDesc = '';
  
  interaction.client.guilds.cache.forEach(guild => {
    serverArray.push({ name: guild.name, members: guild.memberCount });
  })
  serverArray.sort((a, b) => { return b.members - a.members });
  for (const server of serverArray) {
    serversDesc = serversDesc.concat('', `**${server.name}** | ${server.members} members\n`);
    serverSum += 1;
  }
  serversDesc = serversDesc.concat('', `\nTotal amount: ${serverSum}`);
  servers.setDescription(serversDesc);
  embeds.push(servers);

  //Command usage
  const commandStats = buildEmbed().setTitle('How much each command has been used:');
  const commands = await getCommands();
  let commandSum = 0, commandDesc = '';
  
  for (const command of commands) {
    commandDesc = commandDesc.concat('', `**${command.command}** | ${command.amount}\n`);
    commandSum += command.amount;
  }
  commandDesc = commandDesc.concat('', `\nTotal amount: ${commandSum}`);
  commandStats.setDescription(commandDesc);
  embeds.push(commandStats);

  //unbox command stats
  const unboxStats = buildEmbed().setTitle('How much each box has been opened:');
  const boxes = await getBoxes();
  let unboxSum = 0, unboxDesc = '';
  
  for (const box of boxes) {
    unboxDesc = unboxDesc.concat('', `**${box.box}** | ${box.amount}\n`);
    unboxSum += box.amount;
  }
  unboxDesc = unboxDesc.concat('', `\nTotal opened: ${unboxSum}`);
  unboxStats.setDescription(unboxDesc);
  embeds.push(unboxStats);

  //Amount of tradelogs
  const logStats = buildEmbed().setTitle('These are the amount of tradelogs:');
  const channels = JSON.parse(fs.readFileSync(`src/data/tradelogs.json`));
  let logSum = 0, logsDesc = '';
  
  for (const channel of channels) {
    logsDesc = logsDesc.concat('', `**${channel.name}** | ${channel.amount}\n`);
    logSum += channel.amount;
  }
  logsDesc = logsDesc.concat('', `\nTotal amount: ${logSum}`);
  logStats.setDescription(logsDesc);
  embeds.push(logStats);

  //findlogs command stats
  const searchStats = buildEmbed().setTitle('Top 20 searched items:');
  const items = await getSearched();
  let itemCount = 0, searchDesc = '';
  
  for (const item of items) {
    itemCount += 1;
    searchDesc = searchDesc.concat('', `**${itemCount}. ${item.item}** | ${item.amount}\n`);
    if (itemCount > 19) break;
  }
  searchStats.setDescription(searchDesc);
  embeds.push(searchStats);

  return embeds;
}

module.exports = {
  buildStats
}