const { buildEmbed } = require('../../functions/general');
const fs = require('fs');

const buildStats = (embeds, interaction) => {
  const logStats = buildEmbed().setTitle('These are the amount of logs:');
  let logSum = 0;
  let logsDesc = '';
  const channels = JSON.parse(fs.readFileSync(`src/data/stats/tradelogs.json`));
  for (const channel of channels) {
    logsDesc = logsDesc.concat('', `**${channel.name}** | ${channel.amount}\n`);
    logSum += channel.amount;
  }
  logsDesc = logsDesc.concat('', `\nTotal amount: ${logSum}`);
  logStats.setDescription(logsDesc);
  embeds.push(logStats);

  const servers = buildEmbed().setTitle('I am in these servers:');
  let serverSum = 0;
  let serversDesc = '';
  interaction.client.guilds.cache.forEach(guild => {
    serversDesc = serversDesc.concat('', `**${guild.name}** | ${guild.memberCount} members\n`);
    serverSum += 1;
  })
  serversDesc = serversDesc.concat('', `\nTotal amount: ${serverSum}`);
  servers.setDescription(serversDesc);
  embeds.push(servers);

  const commandStats = buildEmbed().setTitle('How much each command has been used:');
  let commandSum = 0;
  let commandDesc = '';
  const commands = JSON.parse(fs.readFileSync(`src/data/stats/commands.json`));
  for (const command of commands) {
    commandDesc = commandDesc.concat('', `**${command.name}** | ${command.amount}\n`);
    commandSum += command.amount;
  }
  commandDesc = commandDesc.concat('', `\nTotal amount: ${commandSum}`);
  commandStats.setDescription(commandDesc);
  embeds.push(commandStats);

  const unboxStats = buildEmbed().setTitle('How much each box has been opened:');
  let unboxSum = 0;
  let unboxDesc = '';
  const boxes = JSON.parse(fs.readFileSync(`src/data/stats/boxes.json`));
  for (const box in boxes) {
    unboxDesc = unboxDesc.concat('', `**${box}** | ${boxes[box]}\n`);
    unboxSum += boxes[box];
  }
  unboxDesc = unboxDesc.concat('', `\nTotal opened: ${unboxSum}`);
  unboxStats.setDescription(unboxDesc);
  embeds.push(unboxStats);

  const searchStats = buildEmbed().setTitle('Most searched items:');
  let searchDesc = '';
  let itemCount = 0;
  const items = JSON.parse(fs.readFileSync(`src/data/stats/search.json`));
  for (const item in items) {
    itemCount += 1;
    searchDesc = searchDesc.concat('', `**${itemCount}. ${item}** | ${items[item]}\n`);
    if (itemCount > 19) { break }
  }
  searchStats.setDescription(searchDesc);
  embeds.push(searchStats);

  return embeds;
}

module.exports = {
  buildStats
}