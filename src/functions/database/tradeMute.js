const mongoose = require('mongoose');
const buy = require('../../data/schemas/moderation/buyMute');
const sell = require('../../data/schemas/moderation/sellMute');

const dbBuyMute = async (member, logChannel, exp) => {
  let buyProfile = await buy.findOne({ _id: member.id });

  if (!buyProfile) {
    const expires = exp || new Date();
    expires.setHours(expires.getHours() + 22);
    
    buyProfile = await new buy({
      _id: member.id,
      tag: member.tag,
      expires: expires,
      })
    await buyProfile.save().catch(err => console.log(err));
  } else {
    await logChannel.send(`<@214787913097936896> ${member.tag} is already in the WTB-mutes database!`);
  }
}

const dbSellMute = async (member, logChannel, exp) => {
  let sellProfile = await sell.findOne({ _id: member.id });

  if (!sellProfile) {
    const expires = exp || new Date();
    expires.setHours(expires.getHours() + 22);
    
    sellProfile = await new sell({
      _id: member.id,
      tag: member.tag,
      expires: expires,
      })
    await sellProfile.save().catch(err => console.log(err));
  } else {
    await logChannel.send(`<@214787913097936896> ${member.tag} is already in the WTS-mutes database!`);
  }
}

const dbCheckExpiredMutes = async (client) => {
  const guild = await client.guilds.fetch('760222722919497820');
  const logChannel = client.channels.cache.get(process.env.botLogs);
  const query = { expires: { $lt: new Date()} };
  
  const WTBexpired = await buy.find(query);
  if (WTBexpired.length > 0) {
    const WTBrole = guild.roles.cache.find((r) => r.name === 'WTB-Cooldown');
    let WTBmentions = 'WTB - Unmuting:';
    await logChannel.send(getMentions(WTBexpired, WTBmentions));
    removeRole(guild.members, WTBexpired, WTBrole);
  }
  await buy.deleteMany(query);
  
  const WTSexpired = await sell.find(query);
  if (WTSexpired.length > 0) {
    const WTSrole = guild.roles.cache.find((r) => r.name === 'WTS-Cooldown');
    let WTSmentions = 'WTS - Unmuting:';
    await logChannel.send(getMentions(WTSexpired, WTSmentions));
    removeRole(guild.members, WTSexpired, WTSrole);
  }
  await sell.deleteMany(query);
}

const removeRole = (members, results, role) => {
  for (const result of results) {
    const member = members.cache.get(result._id);
    if (!member) { continue }
    member.roles.remove(role);
  }
}

const getMentions = (results, mentions) => {
  for (const result of results) {
    mentions = mentions.concat(' ', `<@${result._id}>`)
  }

  console.log(mentions)
  return mentions;
}

module.exports = {
  dbBuyMute,
  dbSellMute,
  dbCheckExpiredMutes
}