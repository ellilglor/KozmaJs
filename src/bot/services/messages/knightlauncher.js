const knightlauncher = async (message) => {
  switch (message.channelId) {
    case '1059194248894885968': await sendListings(message); break;
  }
}

const sendListings = async (message) => {
  if (message.webhookId === '1059194506248978432') {
    await message.channel.send(`<@&1059195232018772031> The following has been posted:\n${message.content}`);
  }
}

module.exports = {
  knightlauncher
};