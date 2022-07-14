const { MessageEmbed } = require('discord.js');
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

  for (const uv of uvs) {
    while (uv.includes(uvType)) uvType = getUvType(itemType, crafting);
  }
  
  const result = uvType + uvGrade;

  return result;
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
  const itemList = JSON.parse(fs.readFileSync(`src/data/punch.json`));

  for (const item of itemList) {
    if (match.includes(item.name)) return item.url;
  }
}

const lockUv = async (interaction, uv) => {
  const embed = new MessageEmbed(interaction.message.embeds[0]);
  const buttons = interaction.message.components;
  let lockCount = 0;

  embed.fields[uv - 1].name = embed.fields[uv - 1].name.includes('🔒') ? `🔓 UV #${uv}` : `🔒 UV #${uv}`;

  for (const field of embed.fields) {
    if (field.name.includes('🔒')) lockCount += 1;
  }

  switch(lockCount) {
    case 3:
      buttons[1].components[3].disabled = true;
      break;
    case 2:
      buttons[1].components[2].disabled = true;
      buttons[1].components[3].disabled = false;
      break;
    case 1:
      buttons[1].components[1].disabled = true;
      buttons[1].components[2].disabled = false;
      buttons[1].components[3].disabled = false;
      break;
    default:
      buttons[1].components[1].disabled = false;
      buttons[1].components[2].disabled = false;
      buttons[1].components[3].disabled = false;
  } 

  await interaction.update({ embeds: [embed], components: buttons });
}

module.exports = {
  craftItem,
  rollUv,
  getPunchImage,
  lockUv
}