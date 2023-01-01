const { dbBuyMute, dbSellMute } = require('@functions/database/tradeMute');
const { scamPrevention } = require('@structures/reminders');
const { tradelogEmbed } = require('@functions/general');
const { globals } = require('@data/variables');
const fs = require('fs');

const giveMute = async ({ member, guild, createdAt, channelId }, logChannel) => {
  if (member.roles.cache.has(globals.adminId) || member.roles.cache.has(globals.modId)) return;
  
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
  const editRole = guild.roles.cache.get(globals.editRoleId);
  
  await guild.members.fetch();
  await guild.roles.cache.get(globals.editRoleId).members.forEach(m => m.roles.remove(editRole));
  
  const WTBchannel = client.channels.cache.get(globals.wtbChannelId);
  const WTSchannel = client.channels.cache.get(globals.wtsChannelId);
  const WTBrole = guild.roles.cache.find(r => r.name === globals.wtbRole);
  const WTSrole = guild.roles.cache.find(r => r.name === globals.wtsRole);

  console.log(string);
  await logChannel.send(string);
  await checkTradeMessages(WTBchannel, WTBrole, logChannel);
  await checkTradeMessages(WTSchannel, WTSrole, logChannel);
  await sendScamPrevention(WTSchannel, client);
}

const checkTradeMessages = async (channel, role, logChannel) => {
  const messages = await channel.messages.fetch({ limit: 25 });
  const title = 'This message is a reminder of the __22 hour slowmode__ in this channel!';
  let remind = true;

  for (const [id, msg] of messages) {
    const expires = msg.createdAt;
    expires.setHours(expires.getHours() + 22);
    if (globals.date > expires) break;

    if (msg.author.bot && msg.embeds[0]?.data.title === title) remind = false;
    
    const member = msg.member;
    if (!member || msg.author.bot) continue;
    if (member.roles.cache.has(role.id)) continue;
    if (member.roles.cache.has(globals.adminId) || member.roles.cache.has(globals.modId)) continue;

    const object = { m : member, roles : member.roles.cache };
    fs.writeFileSync(`src/${role.name}.json`, JSON.stringify(object, null, 2));

    await member.roles.add(role);

    switch (role.name) {
      case globals.wtbRole: await dbBuyMute(member.user, logChannel, msg.createdAt); break;
      case globals.wtsRole: await dbSellMute(member.user, logChannel, msg.createdAt); break;
    }
  }

  if ((globals.date.getDate() % 2) === 0 && remind) await sendSlowmodeReminder(channel, title);
}

const sendSlowmodeReminder = async (channel, title) => {
  const reminder = tradelogEmbed()
    .setTitle(title)
    .setDescription('You can edit your posts through the **/tradepostedit** command.\n' +
                    'We apologise for any inconvenience this may cause.')
    .addFields([{ 
      name: '\u200B', 
      value: 'Interested in what an item has sold for in the past?\nUse the **/findlogs** command.'
    }]);
  
  await channel.send({ embeds: [reminder] });
}

const sendScamPrevention = async (WTSchannel, client) => {
  if ((globals.date.getDate() % 3) !== 0) return;
  
  const messages = await WTSchannel.messages.fetch({ limit: 25 });
  const arcadeTrade = client.channels.cache.get('189463596726616064'); 
  const title = 'Trading Guidelines';
  let sendEmbed = true;

  messages.every(msg => {
    if (!msg.author.bot) return true;

    const msgTitle = msg.embeds[0]?.data.title;
    const timer = msg.createdAt;
    timer.setHours(timer.getHours() + 5);

    if ((msgTitle !== title && timer > globals.date) || msgTitle === title) sendEmbed = false;
    
    return sendEmbed;
  });

  if (!sendEmbed) return;

  const num = Math.floor(Math.random() * scamPrevention.length);
  const [fieldName, fieldValue] = scamPrevention[num];
  
  const embed = tradelogEmbed()
    .setTitle(title)
    .addFields([{ name: fieldName, value: fieldValue }])
    .setFooter({ 
      text: `Information and communication is essential to negotiations. Please be careful!`, 
      iconURL: client.user.displayAvatarURL()
    });

  await WTSchannel.send({ embeds: [embed] });
}

module.exports = {
  giveMute,
  checkOldMessages
}