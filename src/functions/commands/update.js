const fetchAll = require('discord-fetch-all');
const fs = require('fs');
const { contentFilter } = require('../general');

const convertLogs = async (interaction, channelName, id) => {
  const channel = interaction.guild.channels.cache.get(id);
  const messages = [];
  const allMessages = await fetchAll.messages(channel);

  for (const message of allMessages) {
    const msg = messageSnipper(message);
    if (msg) { messages.push(msg); }
  }

  fs.writeFileSync(`src/data/tradelogs/${channelName}.json`, JSON.stringify(messages));
  return { name: channelName, amount: messages.length };
};

const messageSnipper = (msg) => {
  if (!msg.content) { return; }

  msg.attachments.first() ? imageUrl = msg.attachments.first().url : imageUrl = null;

  const msgContent = contentFilter(msg.content);
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
  fs.writeFileSync(`src/data/tradelogs.json`, JSON.stringify(stats));
}

module.exports = {
  convertLogs,
  saveStats
};