const dbRepo = require('@database/repos/dbRepo');
const { muteTypes } = require('@database/repos/types');
const { globals } = require('@utils/variables');

const giveMute = async ({ member, guild, createdAt, channelId }, logChannel) => {
  if (member.roles.cache.has(globals.adminId) || member.roles.cache.has(globals.modId)) return;
  
  const name = channelId === globals.wtbChannelId ? globals.wtbRole : globals.wtsRole;
  const role = guild.roles.cache.find(r => r.name === name);

  if (!role) return await logChannel.send(`<@${globals.ownerId}> no role "${name}" was found`);

  switch (name) {
    case globals.wtbRole: await dbRepo.giveMute(muteTypes.buy ,member.user, createdAt, logChannel); break;
    case globals.wtsRole: await dbRepo.giveMute(muteTypes.sell, member.user, createdAt, logChannel); break;
  }

  await member.roles.add(role);
}

module.exports = {
  giveMute
}