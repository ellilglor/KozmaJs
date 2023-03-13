const { createLog, saveLogs, checkLog } = require('@functions/database/tradelogs');
const { saveRate } = require('@functions/database/rate');
const { contentFilter } = require('@functions/general');
const { channels } = require('@structures/findlogs');
const wait = require('util').promisify(setTimeout);
const { globals } = require('@data/variables');
const fetchAll = require('discord-fetch-all');
const tesseract = require('tesseract.js');
const sharp = require('sharp');
const https = require('https');
const fs = require('fs');

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
  let msgContent = contentFilter(msg.content), d = '2021-04-04';

  if (regex.test(msgContent)) {
    parts = regex.exec(msgContent)[0].split('/');
    d = new Date(parts[2], parseInt(parts[1] - 1), parts[0]).toUTCString().slice(0,16);
  } else {
    d = new Date(msg.createdAt).toUTCString().slice(0,16);
  }

  if (msg.attachments.reduce(count => count += 1, 0) > 1) {
    msgContent = msgContent.concat('\n\n', '*This message had multiple images*\n*Click the date to look at them*');
  }

  const profile = createLog({
    id: msg.id,
    channel: channel,
    author: author,
    date: d,
    url: msg.url,
    content: msgContent,
    original: msg.content,
    image: image
  });

  return profile;
};

const updateRate = async ({ attachments }, logChannel) => {
  if (!attachments.first()) return console.log('This message has no image!');

  console.log('Extracting data from market image');
  
  const url = attachments.first().url;
  const path = './src/data/images/market.png';

  https.get(url, res => {
    const file = fs.createWriteStream(path); // Open file in local filesystem
    res.pipe(file); // Write data into local file
    file.on('finish', () => { file.close() }); // Close the file
  }).on('error', err => { console.log('Error: ', err.message) });

  await wait(500);

  const buyOrder = await sharp(path)
    .extract({ left: 100, top: 120, width: 60, height: 23 }).png().toBuffer();
  const sellOrder = await sharp(path)
    .extract({ left: 455, top: 120, width: 60, height: 23 }).png().toBuffer();

  const { data: { text: left } } = await tesseract.recognize(buyOrder);
  const { data: { text: right } } = await tesseract.recognize(sellOrder);

  const buy = parseInt(left.replace(/[^0-9]/g, '').trim().slice(0, 2));
  const sell = parseInt(right.replace(/[^0-9]/g, '').trim().slice(0, 2));

  if ((sell > buy) != true) return console.log('Failed to properly read values of the image');

  const newRate = Math.floor(buy + (sell - buy) / 2);
  console.log(`calculated rate: ${newRate}`);
  
  await saveRate(newRate);
  await logChannel.send(`The conversion rate has been updated to ${newRate}`);
}

module.exports = {
  convertLogs,
  checkForNewLogs,
  updateRate
};