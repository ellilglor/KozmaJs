const { tradelogEmbed } = require('@utils/functions');
const fetch = require('node-fetch');
const { getEvents, updateEvent } = require('@database/functions/timedEvents');
const { saveRate } = require('@database/functions/rate');
const { globals } = require('@utils/variables');
const { scamPrevention } = require('@utils/reminders');
const { convertLogs } = require('@commands/kbp/update/functions/update');
const { channels } = require('@commands/information/findLogs/data/findlogs');
const { dbBuyMute, dbSellMute } = require('@database/functions/tradeMute');

const checkTimedEvents = async (client) => {
  const entries = await getEvents({ name: { $ne: events.offlineMutes.name }});
  const d = new Date();

  entries.forEach(async (entry) => {
    const expired = entry.updatedAt.setHours(entry.updatedAt.getHours() + events[entry.name].time) < d;

    if (!expired) return;

    switch (entry.name) {
      case events.energyMarket.name: await postEnergyMarket(client); break;
      case events.slowmodeReminder.name: await postSlowModeReminder(client); break;
      case events.scamPrevention.name: await postScamPrevention(client); break;
      case events.newLogs.name: await checkForNewLogs(client); break;
    }

    await updateEvent(entry.name);
  })
}

const postEnergyMarket = async (client) => {
  const crown = '<:kbpcrowns:1092398578053431366>', energy = '<:kbpenergy:1092398618939506718>';
  const channel = client.channels.cache.get('866981820846047232');
  const data = await fetch(process.env.energyMarket).then(res => res.json());
  
  const buyPrice = data.buyOffers.reduce((total, offer) => total + (offer.price * offer.volume), 0);
  const buyCount = data.buyOffers.reduce((total, offer) => total + offer.volume, 0);
  const buyAverage = Math.round(buyPrice / buyCount);
  const sellPrice = data.sellOffers.reduce((total, offer) => total + (offer.price * offer.volume), 0);
  const sellCount = data.sellOffers.reduce((total, offer) => total + offer.volume, 0);
  const sellAverage = Math.round(sellPrice / sellCount);
  const rate = Math.round((buyAverage + (sellAverage - buyAverage) / 2) / 100);
    
  const embed = tradelogEmbed()
    .setTitle(new Date(data.datetime).toUTCString().slice(0,16))
    .setDescription(
      `**Last trade price: ${crown} ${data.lastPrice.toLocaleString()}**\n` +
      `**Recommended conversion rate: ${crown} ${rate} per ${energy} 1**`
    )
    .addFields([
    { 
      name: `Top Offers to Buy ${energy} 100`,
      value: data.buyOffers.reduce(
        (t, o) => t.concat('\n', `${crown} ${o.price.toLocaleString()} x ${o.volume.toLocaleString()}`), ''),
      inline: true
    },{ 
      name: '\u200B',
      value: '\u200B',
      inline: true 
    },{ 
      name: `Top Offers to Sell ${energy} 100`,
      value: data.sellOffers.reduce(
        (t, o) => t.concat('\n', `${crown} ${o.price.toLocaleString()} x ${o.volume.toLocaleString()}`), ''),
      inline: true
    }]);

  await saveRate(rate);
  await channel.send({ embeds: [embed] });
}

const postSlowModeReminder = async (client) => {
  const WTBchannel = client.channels.cache.get(globals.wtbChannelId);
  const WTSchannel = client.channels.cache.get(globals.wtsChannelId);

  const reminder = tradelogEmbed()
    .setTitle(`This message is a reminder of the __${globals.slowmodeHours} hour slowmode__ in this channel!`)
    .setDescription('You can edit your posts through the **/tradepostedit** command.\n' +
                    'We apologise for any inconvenience this may cause.')
    .addFields([{ 
      name: '\u200B', 
      value: 'Interested in what an item has sold for in the past?\nUse the **/findlogs** command.'
    }]);
  
  await WTBchannel.send({ embeds: [reminder] });
  await WTSchannel.send({ embeds: [reminder] });
}

const postScamPrevention = async (client) => {
  const WTSchannel = client.channels.cache.get(globals.wtsChannelId);

  const num = Math.floor(Math.random() * scamPrevention.length);
  const [fieldName, fieldValue] = scamPrevention[num];
  
  const embed = tradelogEmbed()
    .setTitle('Trading Guidelines')
    .addFields([{ name: fieldName, value: fieldValue }])
    .setFooter({ 
      text: `Information and communication is essential to negotiations. Please be careful!`, 
      iconURL: client.user.displayAvatarURL()
    });

  await WTSchannel.send({ embeds: [embed] });
}

const checkForNewLogs = async (client) => {
  const logChannel = client.channels.cache.get(globals.botLogsChannelId);
  const message = 'Checking for new tradelogs.';

  console.log(message);
  await logChannel.send(message);
  const collectAll = false;
  
  for (const [name, id] of channels) {
    const chnl = client.channels.cache.get(id);

    if (!chnl) continue;

    if (chnl.isThread()) {
      await chnl.setArchived(true);
      await chnl.setArchived(false);
    }
    
    await convertLogs(chnl, name, collectAll);
  }
}

const checkTradeMessages = async (client) => {
  const d = new Date();
  const fetched = await getEvents({ name: events.offlineMutes.name });
  const entry = fetched[Object.keys(fetched)[0]];

  if (entry.updatedAt.setHours(entry.updatedAt.getHours() + events[entry.name].time) > d) return;

  const logChannel = client.channels.cache.get(globals.botLogsChannelId);
  const string = 'Checking if people need to be muted.';
  
  const guild = await client.guilds.fetch(globals.serverId);
  const editRole = guild.roles.cache.get(globals.editRoleId);
  
  await guild.members.fetch();
  await guild.roles.cache.get(globals.editRoleId).members.forEach(m => m.roles.remove(editRole));
  
  const WTBchannel = client.channels.cache.get(globals.wtbChannelId);
  const WTSchannel = client.channels.cache.get(globals.wtsChannelId);
  const WTBrole = guild.roles.cache.find(r => r.name === globals.wtbRole);
  const WTSrole = guild.roles.cache.find(r => r.name === globals.wtsRole);

  const checkMessages = async (channel, role, logChannel, d) => {
    const messages = await channel.messages.fetch({ limit: 25 });
  
    for (const [id, msg] of messages) {
      const expires = msg.createdAt;
      expires.setHours(expires.getHours() + globals.slowmodeHours);
      if (d > expires) break;
      
      const member = msg.member;
      if (!member || msg.author.bot) continue;
      if (member.roles.cache.has(role.id)) continue;
      if (member.roles.cache.has(globals.adminId) || member.roles.cache.has(globals.modId)) continue;
  
      await member.roles.add(role);
  
      switch (role.name) {
        case globals.wtbRole: await dbBuyMute(member.user, logChannel, msg.createdAt); break;
        case globals.wtsRole: await dbSellMute(member.user, logChannel, msg.createdAt); break;
      }
    }
  }

  console.log(string);
  await logChannel.send(string);
  await checkMessages(WTBchannel, WTBrole, logChannel, d);
  await checkMessages(WTSchannel, WTSrole, logChannel, d);
  await updateEvent(entry.name);
}

const events = {
  energyMarket: { name: 'energyMarket', time: 12 },
  slowmodeReminder: { name: 'slowmodeReminder', time: 36 },
  scamPrevention: { name: 'scamPrevention', time: 72 },
  newLogs: { name: 'newLogs', time: 6 },
  offlineMutes: { name: 'offlineMutes', time: 3 }
}

module.exports = {
  checkTimedEvents,
  checkTradeMessages
}