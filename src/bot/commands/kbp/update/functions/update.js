const { createLog, saveLogs, checkLog } = require('@database/functions/tradelogs');
const { contentFilter } = require('@functions/general');
const { channels } = require('@commands/information/findLogs/data/findlogs');
const { globals } = require('@data/variables');
const fetchAll = require('discord-fetch-all');

const convertLogs = async (channel, channelName, collectAll) => {
  const logs = [], clearDB = collectAll;

  if (collectAll) {
    await fetchAll.messages(channel).then(messages => {
      messages.every( message => {
        const msg = messageSnipper(message, channelName);
        if (!msg) return true;
        logs.push(msg);
        return true;
      })
    })
  } else {
    const messages = await channel.messages.fetch({ limit: 20 });

    for (const [id, message] of messages) {
      const msg = messageSnipper(message, channelName);
      if (!msg) continue;
      if (await checkLog(id)) break;
      logs.push(msg);
    }
  }

  await saveLogs(logs, channelName, clearDB);
  return { name: channelName, amount: logs.length };
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
  const collectAll = false;
  
  for (const [name, id] of channels) {
    const chnl = client.channels.cache.get(id);

    if (!chnl) continue;

    if (chnl.isThread()) {
      await chnl.setArchived(true);
      await chnl.setArchived(false);
    }
    
    await convertLogs(chnl, name, collectAll);
  }
}

const messageSnipper = (msg, channel) => {
  if (!msg.content) return;
  
  const regex = /([0-9]{2}\/[0-9]{2}\/[0-9]{4})/;
  const author = msg.author.tag.includes('Knight Launcher') ? 'Haven Server' : msg.author.tag;
  const image = msg.attachments.first() ? msg.attachments.first().url : null;
  const filtered = contentFilter(msg.content);
  let d = '2021-04-04', text = msg.content;

  if (regex.test(filtered)) {
    parts = regex.exec(filtered)[0].split('/');
    d = new Date(parts[2], parseInt(parts[1] - 1), parts[0]).toUTCString().slice(0,16);
  } else {
    d = new Date(msg.createdAt).toUTCString().slice(0,16);
  }

  if (msg.attachments.reduce(count => count += 1, 0) > 1) {
    text = text.concat('\n\n', '*This message had multiple images*\n*Click the date to look at them*');
  }

  const profile = createLog({
    id: msg.id,
    channel: channel,
    author: author,
    date: d,
    url: msg.url,
    content: filtered,
    original: text,
    image: image
  });

  return profile;
};

module.exports = {
  convertLogs,
  checkForNewLogs
};