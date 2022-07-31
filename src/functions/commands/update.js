const { contentFilter } = require('@functions/general');
const { channels } = require('@structures/findlogs');
const { globals } = require('@data/variables');
const fetchAll = require('discord-fetch-all');
const fs = require('fs');

const convertLogs = async (channel, channelName, collectAll) => {
  const location = `src/data/tradelogs/${channelName}.json`;
  const filtered = collectAll ? [] : JSON.parse(fs.readFileSync(location));
  const messages = collectAll ? await fetchAll.messages(channel) : await channel.messages.fetch({ limit: 20 });
  const temp = [];

  messages.every(message => {
    const msg = messageSnipper(message);
    if (!msg) return true;
    
    if (collectAll) {
      filtered.push(msg);
    } else {
      if (filtered[0].discordId === msg.discordId) return false;
      temp.push(msg);
    }

    return true;
  })

  const final = temp.concat(filtered);

  fs.writeFileSync(location, JSON.stringify(final));
  return { name: channelName, amount: final.length };
};

const checkForNewLogs = async (client) => {
  const logChannel = client.channels.cache.get(globals.botLogsChannelId);
  const string = 'Checking for new tradelogs.';
  let stop = false;

  const logMessages = await logChannel.messages.fetch({ limit: 20 });
  logMessages.every(msg => {
    if (msg.content === string) stop = true;
    return !stop;
  });

  if (stop) return;

  console.log(string);
  await logChannel.send(string);
  const stats = [], collectAll = false;
  
  for (const [name, id] of channels) {
    const chnl = client.channels.cache.get(id);

    if (!chnl) continue;

    if (chnl.isThread()) {
      await chnl.setArchived(true);
      await chnl.setArchived(false);
    }
    
    stats.push(await convertLogs(chnl, name, collectAll));
  }

  saveStats(stats);
}

const messageSnipper = (msg) => {
  if (!msg.content) return;

  const image = msg.attachments.first() ? msg.attachments.first().url : null;
  const msgContent = contentFilter(msg.content);
  const d = new Date(msg.createdAt).toUTCString().slice(0,16);

  return {
    discordId: msg.id,
    date: d,
    messageUrl: msg.url,
    content: msgContent,
    image: image
  };
};

const saveStats = (stats) => {
  fs.writeFileSync(`src/data/tradelogs/tradelogs.json`, JSON.stringify(stats));
}

module.exports = {
  convertLogs,
  checkForNewLogs,
  saveStats
};