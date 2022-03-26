const { dbBuyMute, dbSellMute, dbCheckExpiredMutes } = require('../database/tradeMute');
const staffIds = ['214787913097936896', '922921889347817483', '282992095835455489', '452999349882847242'];

const giveBuyMute = async (message, logChannel) => {
  if (staffIds.includes(message.member.user.id)) { return }
  
  const role = message.guild.roles.cache.find((r) => r.name === 'WTB-Cooldown');

  if (!role) {
    await logChannel.send(`<@214787913097936896> no role with the name 'WTB-Cooldown' was found`);
    return;
  }

  await dbBuyMute(message.member.user, logChannel);
  message.member.roles.add(role);
}

const giveSellMute = async (message, logChannel) => {
  if (staffIds.includes(message.member.user.id)) { return }
  
  const role = message.guild.roles.cache.find((r) => r.name === 'WTS-Cooldown');

  if (!role) {
    await logChannel.send(`<@214787913097936896> no role with the name 'WTS-Cooldown' was found`);
    return;
  }

  await dbSellMute(message.member.user, logChannel);
  message.member.roles.add(role);
}

const checkOldMessages = async (client) => {
  const logChannel = client.channels.cache.get(process.env.botLogs);
  const guild = await client.guilds.fetch('760222722919497820');
  const d = new Date();

  const WTBchannel = client.channels.cache.get('872172994158538812');
  const WTBrole = guild.roles.cache.find((r) => r.name === 'WTB-Cooldown');
  let WTBmentions = 'WTB - Checking if these people need to be muted:';
  const WTBids = {};

  const WTBmessages = await WTBchannel.messages.fetch({ limit: 25 });
  WTBmessages.forEach(msg => {
    const expires = msg.createdAt
    expires.setHours(expires.getHours() + 23);
    
    if (d > expires) { return }
    if (staffIds.includes(msg.author.id)) { return };
    
    WTBmentions = WTBmentions.concat(' ', `<@${msg.author.id}>`)
    WTBids[msg.author.id] = msg.createdAt;
  });
  
  if (Object.keys(WTBids).length > 0) {
    await logChannel.send(WTBmentions);
    for (const id in WTBids) {
      const member = guild.members.cache.get(id);
      if (member && !member.roles.cache.has(WTBrole.id)) {
        member.roles.add(WTBrole);
        await dbBuyMute(member.user, logChannel, WTBids[id]);
      }
    }
  }

  const WTSchannel = client.channels.cache.get('872173055386980373');
  const WTSrole = guild.roles.cache.find((r) => r.name === 'WTS-Cooldown');
  let WTSmentions = 'WTS - Checking if these people need to be muted:';
  const WTSids = {};

  const WTSmessages = await WTSchannel.messages.fetch({ limit: 25 });
  WTSmessages.forEach(msg => {
    const expires = msg.createdAt
    expires.setHours(expires.getHours() + 23);
    
    if (d > expires) { return }
    if (staffIds.includes(msg.author.id)) { return };
    
    WTSmentions = WTSmentions.concat(' ', `<@${msg.author.id}>`)
    WTSids[msg.author.id] = msg.createdAt;
  });

  if (Object.keys(WTSids).length > 0) {
    await logChannel.send(WTSmentions);
    for (const id in WTSids) {
      const member = guild.members.cache.get(id);
      if (member && !member.roles.cache.has(WTSrole.id)) {
        member.roles.add(WTSrole);
        await dbSellMute(member.user, logChannel, WTSids[id]);
      }
    }
  }
}

module.exports = {
  giveBuyMute,
  giveSellMute,
  checkOldMessages
}