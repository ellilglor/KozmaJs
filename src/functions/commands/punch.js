const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');

const craftItem = (item) => {
  const craftRoll = roll();
  const uvs = [], crafting = true;

  if (craftRoll <= 10) {
    for (let i=1; i <= 3; i++) {
      uvs.push(rollUv(item, crafting, uvs));
    }
  } else if (craftRoll <= 100) {
    for (let i=1; i <= 2; i++) {
      uvs.push(rollUv(item, crafting, uvs));
    }
  } else if (craftRoll <= 1000) {
    uvs.push(rollUv(item, crafting, uvs));
  }

  return uvs;
}

const rollUv = (item, crafting, uvs) => {
  const itemType = getItemType(item);
  const uvGrade = getUvGrade(itemType);
  let uvType = getUvType(itemType, crafting);

  uvs.forEach(uv => {
    while (uv.includes(uvType)) uvType = getUvType(itemType, crafting);
  });

  return uvType + uvGrade;
}

const getUvGrade = (type) => {
  const gradeRoll = roll();
  let result = '\n';

  if (gradeRoll <= 245) {
    result += type.includes('weapon') ? 'Very High' : 'Maximum';
  } else {
    result += gradeRoll <= 732 ? 'High' : gradeRoll <= 2683 ? 'Medium' : 'Low';
  } 

  return result;
}

const getUvType = (type, crafting) => {
  if (type.includes('weapon')) {
    const weaponRoll = Math.floor(Math.random() * 8);
    switch (weaponRoll) {
      case 0: result = 'Attack Speed Increase:'; break;
      case 1: result = 'Charge Time Reduction:'; break;
      case 2: result = 'Damage Bonus vs Construct:'; break;
      case 3: result = 'Damage Bonus vs Gremlin:'; break;
      case 4: result = 'Damage Bonus vs Fiend:'; break;
      case 5: result = 'Damage Bonus vs Beast:'; break;
      case 6: result = 'Damage Bonus vs Undead:'; break;
      case 7: result = 'Damage Bonus vs Slime:';
    }
  } else {
    if (type.includes('armor') || (type.includes('shield') && crafting)) {
      armorRoll = Math.floor(Math.random() * 11);
    } else {
      armorRoll = Math.floor(Math.random() * 4);
    }
    
    switch (armorRoll) {
      case 0: result = 'Increased Normal Defense:'; break;
      case 1: result = 'Increased Piercing Defense:'; break;
      case 2: result = 'Increased Elemental Defense:'; break;
      case 3: result = 'Increased Shadow Defense:'; break;
      case 4: result = 'Increased Stun Resistance:'; break;
      case 5: result = 'Increased Freeze Resistance:'; break;
      case 6: result = 'Increased Poison Resistance:'; break;
      case 7: result = 'Increased Fire Resistance:'; break;
      case 8: result = 'Increased Shock Resistance:'; break;
      case 9: result = 'Increased Curse Resistance:'; break;
      case 10: result = 'Increased Sleep Resistance:';
    }
  }

  return result;
}

const getItemType = (item) => {
  const weapons = ['Brandish', 'Overcharged Mixmaster'];
  const shield = 'Swiftstrike Buckler';
  const result = weapons.includes(item) ? 'weapon' : shield.includes(item) ? 'shield' : 'armor';

  return result;
}

const roll = () => {
  return Math.floor(Math.random() * 10001);
}

const getPunchImage = (match) => {
  const itemList = JSON.parse(fs.readFileSync(`src/data/punch/items.json`));

  for (const item of itemList) {
    if (match.includes(item.name)) return item.url;
  }
}

const lockUv = async (interaction, uv) => {
  const embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(null);
  const lockButtons = ActionRowBuilder.from(interaction.message.components[0]);
  const gambleButtons = ActionRowBuilder.from(interaction.message.components[1]);
  let lockCount = 0;

  embed.data.fields[uv - 1].name = embed.data.fields[uv - 1].name.includes('🔒') ? `🔓 UV #${uv}` : `🔒 UV #${uv}`;

  embed.data.fields.forEach(f => { if (f.name.includes('🔒')) lockCount += 1 });

  switch(lockCount) {
    case 3:
      gambleButtons.components[3].setDisabled(true);
      break;
    case 2:
      gambleButtons.components[2].setDisabled(true);
      gambleButtons.components[3].setDisabled(false);
      break;
    case 1:
      gambleButtons.components[1].setDisabled(true);
      gambleButtons.components[2].setDisabled(false);
      gambleButtons.components[3].setDisabled(false);
      break;
    default:
      gambleButtons.components[1].setDisabled(false);
      gambleButtons.components[2].setDisabled(false);
      gambleButtons.components[3].setDisabled(false);
  } 

  await interaction.update({ embeds: [embed], components: [lockButtons, gambleButtons] });
}

const checkForGm = (embed) => {
  const weapons = ['Brandish', 'Overcharged Mixmaster'];
  let count = 0, won = false;

  if (weapons.includes(embed.data.title)) {
    embed.data.fields.forEach(f => {
      if (!f.value.includes('Very High')) return;
      if (f.value.includes('Charge') || f.value.includes('Speed')) count += 1;
      if (count === 2) won = true;
    });
  } else {
    embed.data.fields.forEach(f => {
      if (!f.value.includes('Max')) return;
      if (f.value.includes('Shadow') || f.value.includes('Normal') || f.value.includes('Fire')) count += 1;
      if (count === 3) won = true;
    });
  }
  
  return won && !embed.data.image ? setImage(embed) : won ? embed : embed.setImage(null);
}

const setImage = (embed) => {
  const images = JSON.parse(fs.readFileSync(`src/data/punch/memes.json`));
  const pos = Math.floor(Math.random() * images.length);

  embed.setDescription(
    `Congratulations! You created a GM item!\n` +
    `As a reward you get a random Spiral Knights meme.\n` +
    `Author: ${images[pos].author}`);
  embed.setImage(images[pos].url);
  
  return embed;
}

module.exports = {
  craftItem,
  rollUv,
  getPunchImage,
  lockUv,
  checkForGm
}