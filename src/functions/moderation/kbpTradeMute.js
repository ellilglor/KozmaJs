const { dbBuyMute, dbSellMute } = require('@functions/database/tradeMute');
const { tradelogEmbed } = require('@functions/general');
const { globals } = require('@data/variables');

const giveMute = async ({ member, guild, createdAt, channelId }, logChannel) => {
  const name = channelId === globals.wtbChannelId ? globals.wtbRole : globals.wtsRole;
  const role = guild.roles.cache.find(r => r.name === name);

  if (!role) return await logChannel.send(`<@${globals.ownerId}> no role "${name}" was found`);

  switch (name) {
    case globals.wtbRole: await dbBuyMute(member.user, logChannel, createdAt); break;
    case globals.wtsRole: await dbSellMute(member.user, logChannel, createdAt); break;
  }

  await guild.members.fetch();
  await member.roles.add(role);
}

const checkOldMessages = async (client) => {
  const logChannel = client.channels.cache.get(globals.botLogsChannelId);
  const logMessages = await logChannel.messages.fetch({ limit: 10 });
  const string = 'Checking if people need to be muted.';
  let stop = false;

  logMessages.every(msg => {
    const time = msg.createdAt;
    time.setHours(time.getHours() + 1);

    if (msg.content === string && globals.date < time) stop = true;
    return !stop;
  });

  if (stop) return;
  
  const guild = await client.guilds.fetch(globals.serverId);
  const WTBchannel = client.channels.cache.get(globals.wtbChannelId);
  const WTSchannel = client.channels.cache.get(globals.wtsChannelId);
  const WTBrole = guild.roles.cache.find(r => r.name === globals.wtbRole);
  const WTSrole = guild.roles.cache.find(r => r.name === globals.wtsRole);

  console.log(string);
  await logChannel.send(string);
  await guild.members.fetch();
  await checkTradeMessages(WTBchannel, WTBrole, logChannel);
  await checkTradeMessages(WTSchannel, WTSrole, logChannel);
}

const checkTradeMessages = async (channel, role, logChannel) => {
  const messages = await channel.messages.fetch({ limit: 25 });
  let remind = true;
  
  messages.every(async (msg) => {
    const expires = msg.createdAt;
    expires.setHours(expires.getHours() + 22);
    if (globals.date > expires) return false;

    if (msg.author.bot) remind = false;

    const member = msg.member;
    if (!member || msg.author.bot) return true;
    if (member.roles.cache.some(r => r.id === role.id)) return true;
    if (member.roles.cache.some(r => r.id === globals.adminId || r.id === globals.modId)) return true;

    await member.roles.add(role);

    switch (role.name) {
      case globals.wtbRole: await dbBuyMute(member.user, logChannel, msg.createdAt); break;
      case globals.wtsRole: await dbSellMute(member.user, logChannel, msg.createdAt); break;
    }
    
    return true;
  });

  if ((globals.date.getDate() % 3) === 0 && remind) await sendReminder(channel);
}

const sendReminder = async (channel) => {
  const reminder = tradelogEmbed()
    .setTitle('This message is a reminder of the __22 hour slowmode__ in this channel!')
    .setDescription('Editing your message is not possible due to how we handle this slowmode.\n' +
                    'We apologise for any inconvenience this may cause.');
  
  await channel.send({ embeds: [reminder] });
}

module.exports = {
  giveMute,
  checkOldMessages
}