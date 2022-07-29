const buy = require('../../data/schemas/moderation/buyMute');
const sell = require('../../data/schemas/moderation/sellMute');
const wait = require('util').promisify(setTimeout);
const { globals } = require('../../data/variables');

const dbBuyMute = async (member, logChannel, expires) => {
  let buyProfile = await buy.findOne({ _id: member.id });

  if (!buyProfile) {
    expires.setHours(expires.getHours() + 22);
    
    buyProfile = await new buy({
      _id: member.id,
      tag: member.tag,
      expires: expires,
    })
    await buyProfile.save().catch(err => console.log(err));
  } else {
    await logChannel.send(`WTB - <@${globals.ownerId}> <@${member.id}> is already in the database!`);
  }
}

const dbSellMute = async (member, logChannel, expires) => {
  let sellProfile = await sell.findOne({ _id: member.id });

  if (!sellProfile) {
    expires.setHours(expires.getHours() + 22);
    
    sellProfile = await new sell({
      _id: member.id,
      tag: member.tag,
      expires: expires,
    })
    await sellProfile.save().catch(err => console.log(err));
  } else {
    await logChannel.send(`WTS - <@${globals.ownerId}> <@${member.id}> is already in the database!`);
  }
}

const dbCheckExpiredMutes = async (client) => {
  const guild = await client.guilds.fetch(globals.serverId);
  const logChannel = client.channels.cache.get(globals.botLogsChannelId);
  const query = { expires: { $lt: new Date() } };
  
  await guild.members.fetch();

  const WTBexpired = await buy.find(query);
  if (WTBexpired.length > 0) {
    const WTBrole = guild.roles.cache.find((r) => r.name === globals.wtbRole);
    let WTBmentions = 'WTB - Unmuting:';
    
    await logChannel.send(getMentions(WTBexpired, WTBmentions));
    await removeRole(guild.members, WTBexpired, WTBrole, logChannel);
  }
  await buy.deleteMany(query);
  
  const WTSexpired = await sell.find(query);
  if (WTSexpired.length > 0) {
    const WTSrole = guild.roles.cache.find((r) => r.name === globals.wtsRole);
    let WTSmentions = 'WTS - Unmuting:';
    
    await logChannel.send(getMentions(WTSexpired, WTSmentions));
    await removeRole(guild.members, WTSexpired, WTSrole, logChannel);
  }
  await sell.deleteMany(query);
}

const removeRole = async (members, results, role, logChannel) => {
  for (const result of results) {
    const member = members.cache.get(result._id);
    
    if (!member) {
      await logChannel.send(`<@${globals.ownerId}> Failed to find <@${result._id}>`);
      continue;
    }
    
    member.roles.remove(role);
    await wait(100);
    
    if (member.roles.cache.has(role.id)) {
      await logChannel.send(`<@${globals.ownerId}> Failed to remove ${role.name} from <@${result._id}>`);
    }
  }
}

const getMentions = (results, mentions) => {
  results.forEach(r => { mentions = mentions.concat(' ', `<@${r._id}>`) });

  console.log(mentions);
  return mentions;
}

module.exports = {
  dbBuyMute,
  dbSellMute,
  dbCheckExpiredMutes
}