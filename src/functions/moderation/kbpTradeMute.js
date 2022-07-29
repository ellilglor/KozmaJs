const { dbBuyMute, dbSellMute } = require('../database/tradeMute');
const { globals } = require('../../data/variables');
const { tradelogEmbed } = require('../general');


const giveBuyMute = async ({ member, guild, createdAt }, logChannel) => {
  const role = guild.roles.cache.find(r => r.name.includes(globals.wtbRole));

  if (!role) {
    await logChannel.send(`<@${globals.ownerTag}> no role with the name ${globals.wtbRole} was found`);
    return;
  }

  await dbBuyMute(member.user, logChannel, createdAt);
  await guild.members.fetch();
  member.roles.add(role);
}

const giveSellMute = async ({ member, guild, createdAt }, logChannel) => {
  const role = guild.roles.cache.find(r => r.name.includes(globals.wtsRole));

  if (!role) {
    await logChannel.send(`<@${globals.ownerTag}> no role with the name ${globals.wtsRole} was found`);
    return;
  }

  await dbSellMute(member.user, logChannel, createdAt);
  await guild.members.fetch();
  member.roles.add(role);
}

const checkOldMessages = async (client) => {
  const logChannel = client.channels.cache.get(globals.botLogsChannelId);
  const logMessages = await logChannel.messages.fetch({ limit: 10 });
  const string = 'Checking if people need to be muted.';
  let stop = false;

  logMessages.every(msg => {
    const time = msg.createdAt;
    time.setHours(time.getHours() + 1);

    if (msg.content.includes(string) && globals.date < time) stop = true;
    return !stop;
  });

  if (stop) return;
  
  const guild = await client.guilds.fetch(globals.serverId);
  const WTBchannel = client.channels.cache.get(globals.wtbChannelId);
  const WTSchannel = client.channels.cache.get(globals.wtsChannelId);
  const WTBrole = guild.roles.cache.find(r => r.name.includes(globals.wtbRole));
  const WTSrole = guild.roles.cache.find(r => r.name.includes(globals.wtsRole));

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
    if (!member) return true;
    if (member.roles.cache.has(role.id)) return true;
    if (member.roles.cache.has(globals.adminId) || member.roles.cache.has(globals.modId)) return true;

    member.roles.add(role);

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

// const sendReminder = async (WTBchannel, WTSchannel) => {
//   const reminder = tradelogEmbed()
//     .setTitle('This message is a reminder of the __22 hour slowmode__ in this channel!')
//     .setDescription('Editing your message is not possible due to how we handle this slowmode.\n' +
//                     'We apologise for any inconvenience this may cause.');
  
//   await WTBchannel.send({ embeds: [reminder] });
//   await WTSchannel.send({ embeds: [reminder] });
// }

module.exports = {
  giveBuyMute,
  giveSellMute,
  checkOldMessages
}