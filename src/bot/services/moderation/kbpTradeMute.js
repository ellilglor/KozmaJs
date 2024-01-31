const { dbBuyMute, dbSellMute } = require('@database/functions/tradeMute');
const { globals } = require('@utils/variables');

const giveMute = async ({ member, guild, createdAt, channelId }, logChannel) => {
  if (member.roles.cache.has(globals.adminId) || member.roles.cache.has(globals.modId)) return;
  
  const name = channelId === globals.wtbChannelId ? globals.wtbRole : globals.wtsRole;
  const role = guild.roles.cache.find(r => r.name === name);

  if (!role) return await logChannel.send(`<@${globals.ownerId}> no role "${name}" was found`);

  switch (name) {
    case globals.wtbRole: await dbBuyMute(member.user, logChannel, createdAt); break;
    case globals.wtsRole: await dbSellMute(member.user, logChannel, createdAt); break;
  }

  await member.roles.add(role);
}

module.exports = {
  giveMute
}