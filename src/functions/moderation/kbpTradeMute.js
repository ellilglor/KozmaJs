const { dbBuyMute, dbSellMute, dbCheckExpiredMutes } = require('../database/tradeMute');
const staffIds = ['214787913097936896', '922921889347817483', '282992095835455489', '452999349882847242'];

const giveBuyMute = async ({ member, guild }, logChannel) => {
  if (staffIds.includes(member.user.id)) return;
  
  const role = guild.roles.cache.find((r) => r.name === 'WTB-Cooldown');

  if (!role) {
    await logChannel.send(`<@214787913097936896> no role with the name 'WTB-Cooldown' was found`);
    return;
  }

  await dbBuyMute(member.user, logChannel);
  member.roles.add(role);
}

const giveSellMute = async ({ member, guild }, logChannel) => {
  if (staffIds.includes(member.user.id)) return;
  
  const role = guild.roles.cache.find((r) => r.name === 'WTS-Cooldown');

  if (!role) {
    await logChannel.send(`<@214787913097936896> no role with the name 'WTS-Cooldown' was found`);
    return;
  }

  await dbSellMute(member.user, logChannel);
  member.roles.add(role);
}

const checkOldMessages = async (client) => {
  const logChannel = client.channels.cache.get(process.env.botLogs);
  const string = 'Checking if these people need to be muted:';
  let stop = false;

  const logMessages = await logChannel.messages.fetch({ limit: 25 });
  logMessages.every(msg => {
    if (msg.content.includes(string)) stop = true;
    return !stop;
  })

  if (stop) return;
  
  const guild = await client.guilds.fetch('760222722919497820');
  const d = new Date();

  const WTBchannel = client.channels.cache.get('872172994158538812');
  const WTBrole = guild.roles.cache.find((r) => r.name === 'WTB-Cooldown');
  let WTBmentions = `WTB - ${string}`;
  const WTBids = {};

  const WTBmessages = await WTBchannel.messages.fetch({ limit: 25 });
  WTBmessages.every(msg => {
    const expires = msg.createdAt;
    expires.setHours(expires.getHours() + 22);

    if (d > expires) return false;
    if (staffIds.includes(msg.author.id)) return true;
    
    WTBmentions = WTBmentions.concat(' ', `<@${msg.author.id}>`);
    WTBids[msg.author.id] = msg.createdAt;
    return true;
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
  let WTSmentions = `WTS - ${string}`;
  const WTSids = {};

  const WTSmessages = await WTSchannel.messages.fetch({ limit: 25 });
  WTSmessages.every(msg => {
    const expires = msg.createdAt;
    expires.setHours(expires.getHours() + 22);
    
    if (d > expires) return false;
    if (staffIds.includes(msg.author.id)) return true;
    
    WTSmentions = WTSmentions.concat(' ', `<@${msg.author.id}>`);
    WTSids[msg.author.id] = msg.createdAt;
    return true;
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