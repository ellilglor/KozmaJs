const { tradelogEmbed } = require('@functions/general');
const fetch = require('node-fetch');
const { insertEvent, getEvent, updateEvent } = require('@functions/database/timedEvents');
const { saveRate } = require('@functions/database/rate');

const checkTimedEvents = async (client) => {
  const energyMarket = await getEvent('energyMarket');
  const energyMarketTimer = energyMarket.updatedAt.setHours(energyMarket.updatedAt.getHours() + 12);
  if (energyMarketTimer < new Date()) await energyMarketEvent(client);
}

const energyMarketEvent = async (client) => {
  const crown = '<:kbpcrowns:1092398578053431366>', energy = '<:kbpenergy:1092398618939506718>';
  const channel = client.channels.cache.get('866981820846047232'), eventName = 'energyMarket';
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

  await updateEvent(eventName);
  await saveRate(rate);
  await channel.send({ embeds: [embed] });
}

module.exports = {
  checkTimedEvents
}