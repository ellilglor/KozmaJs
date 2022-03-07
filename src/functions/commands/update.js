const fetchAll = require('discord-fetch-all');
const fs = require('fs');
const { contentFilter } = require('./findlogs');

const convertLogs = async (interaction, channelName, id) => {
  const channel = interaction.guild.channels.cache.get(id);
  const messages = [];

  const allMessages = await fetchAll.messages(channel);
  for (const message of allMessages) {
    const msg = messageSnipper(message, true);
    if (msg) { messages.push(msg); }
  }

  fs.writeFileSync(`src/data/tradelogs/${channelName}.json`, JSON.stringify(messages));
  return { name: channelName, amount: messages.length };
};

const messageSnipper = (msg, filter) => {
  if (!msg.content) { return; }

  msg.attachments.first() ? imageUrl = msg.attachments.first().url : imageUrl = null;

  const msgContent = filter ? contentFilter(msg.content) : msg.content;
  const d = new Date(msg.createdAt).toUTCString().slice(0,16);

  return {
    discordId: msg.id,
    date: d,
    messageUrl: msg.url,
    content: msgContent,
    image: imageUrl
  };
};

const saveStats = (stats) => {
  fs.writeFileSync(`src/data/stats/tradelogs.json`, JSON.stringify(stats));
}

const getBotLogs = async (interaction) => {
  const channel = interaction.guild.channels.cache.get('938857270899523604');
  //const allMessages = JSON.parse(fs.readFileSync(`data/stats/bot-logs.json`));
  const allMessages = await fetchAll.messages(channel);
  const commands = [];
  const commandUsage = [
    //{name: 'punch', amount: 0},
    {name: 'unbox', amount: 0},
    {name: 'findlogs', amount: 0},
    {name: 'convert', amount: 0},
    {name: 'lockbox', amount: 0},
    {name: 'help', amount: 0},
    {name: 'clear', amount: 0},
    {name: 'rate', amount: 0}
  ]

  const boxes = {};
  const items = {};
  const guilds = [];

  interaction.client.guilds.cache.forEach(guild => {
    guilds.push(guild.name);
  })
  
  for (const message of allMessages) {
    for (command of commandUsage) {
      if (!message.content.includes(command.name)) { continue }
      command.amount += 1
      
      if (command.name.includes('unbox') || command.name.includes('findlogs')) {
        const split = message.content.split(' ')
        const pos = split.findIndex(findSlash);

        if (command.name.includes('unbox')) {
          boxes[split[pos+1]] = boxes[split[pos+1]] + 1 || 1;
        }

        if (command.name.includes('findlogs')) {
          const toExtract = split.slice(pos+1).toString().replace(/,/g, ' ');
          const extracted = extractItem(toExtract, guilds);
          items[extracted] = items[extracted] + 1 || 1;
        }
      }
      break;
    }
    commands.push(messageSnipper(message, false));
  }

  const boxesSorted = Object.fromEntries(
    Object.entries(boxes).sort(([,a],[,b]) => b-a)
  );

  const itemsSorted = Object.fromEntries(
    Object.entries(items).sort(([,a],[,b]) => b-a)
  );

  //console.log(commandUsage)
  //console.log(boxesSorted);
  //console.log(itemsSorted)

  fs.writeFileSync(`src/data/stats/bot-logs.json`, JSON.stringify(commands));
  fs.writeFileSync(`src/data/stats/commands.json`, JSON.stringify(commandUsage));
  fs.writeFileSync(`src/data/stats/boxes.json`, JSON.stringify(boxesSorted));
  fs.writeFileSync(`src/data/stats/search.json`, JSON.stringify(itemsSorted));
}

const findSlash = (string) => {
  return string.includes('/unbox') || string.includes('/findlogs');
}

const extractItem = (string, guilds) => {

  if (string.includes(' in DM')) {
    result = string.replace(` in DM`, '');
  } else {
    for (guild of guilds) {
      if (string.includes(guild)) {
        const replace = ` in ${guild}`;
        result = string.replace(replace, '');
      }
    }
  }

  result = result
    .replace(/[0-9]/g, '')
    .replace(' variant-search', '')
    .replace(' single-search', '');
  
  return contentFilter(result);
}

module.exports = {
  convertLogs,
  saveStats,
  getBotLogs
};