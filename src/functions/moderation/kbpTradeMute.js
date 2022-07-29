const { dbBuyMute, dbSellMute } = require('../database/tradeMute');
const { tradelogEmbed } = require('../general');

const giveBuyMute = async ({ member, guild }, logChannel) => {
  const name = 'WTB-Cooldown';
  const role = guild.roles.cache.find(r => r.name.includes(name));

  if (!role) {
    await logChannel.send(`<@214787913097936896> no role with the name ${name} was found`);
    return;
  }

  await dbBuyMute(member.user, logChannel);
  await guild.members.fetch();
  member.roles.add(role);
}

const giveSellMute = async ({ member, guild }, logChannel) => {
  const name = 'WTS-Cooldown';
  const role = guild.roles.cache.find(r => r.name.includes(name));

  if (!role) {
    await logChannel.send(`<@214787913097936896> no role with the name ${name} was found`);
    return;
  }

  await dbSellMute(member.user, logChannel);
  await guild.members.fetch();
  member.roles.add(role);
}

const checkOldMessages = async (client) => {
  const logChannel = client.channels.cache.get(process.env.botLogs);
  const logMessages = await logChannel.messages.fetch({ limit: 10 });
  const string = 'Checking if people need to be muted.';
  const botId = '898505614404235266';
  const d = new Date();
  let stop = false;

  logMessages.every(msg => {
    const time = msg.createdAt;
    time.setHours(time.getHours() + 1);

    if (msg.content.includes(string) && d < time) stop = true;
    return !stop;
  });

  if (stop) return;
  
  const guild = await client.guilds.fetch('760222722919497820');
  const admin = '760222967808131092';
  const mod = '796399775959220304';

  let remind = true;
  
  await guild.members.fetch();
  await logChannel.send(string);

  const WTBrole = guild.roles.cache.find(r => r.name.includes('WTB-Cooldown'));
  const WTBchannel = client.channels.cache.get('872172994158538812');
  const WTBmessages = await WTBchannel.messages.fetch({ limit: 25 });
  
  WTBmessages.every(async (msg) => {
    const expires = msg.createdAt;
    expires.setHours(expires.getHours() + 22);
    if (d > expires) return false;

    if (msg.author.id === botId) {
      remind = false;
      return true;
    }

    const member = msg.member;
    if (member.roles.cache.has(admin) || member.roles.cache.has(mod)) return true;
    if (member.roles.cache.has(WTBrole.id)) return true;

    member.roles.add(WTBrole);
    await dbBuyMute(member.user, logChannel, msg.createdAt);
    
    return true;
  });

  const WTSrole = guild.roles.cache.find(r => r.name.includes('WTS-Cooldown'));
  const WTSchannel = client.channels.cache.get('872173055386980373');
  const WTSmessages = await WTSchannel.messages.fetch({ limit: 25 });
  
  WTSmessages.every(async (msg) => {
    const expires = msg.createdAt;
    expires.setHours(expires.getHours() + 22);
    if (d > expires) return false;

    if (msg.author.id === botId) {
      remind = false;
      return true;
    }

    const member = msg.member;
    if (member.roles.cache.has(admin) || member.roles.cache.has(mod)) return true;
    if (member.roles.cache.has(WTSrole.id)) return true;

    member.roles.add(WTSrole);
    await dbSellMute(member.user, logChannel, msg.createdAt);
    
    return true;
  });

  if ((d.getDate() % 3) === 0 && remind) await sendReminder(WTBchannel, WTSchannel);
}

const sendReminder = async (WTBchannel, WTSchannel) => {
  const reminder = tradelogEmbed()
    .setTitle('This message is a reminder of the __22 hour slowmode__ in this channel!')
    .setDescription('Editing your message is not possible due to how we handle this slowmode.\n' +
                    'We apologise for any inconvenience this may cause.');
  
  await WTBchannel.send({ embeds: [reminder] });
  await WTSchannel.send({ embeds: [reminder] });
}

module.exports = {
  giveBuyMute,
  giveSellMute,
  checkOldMessages
}