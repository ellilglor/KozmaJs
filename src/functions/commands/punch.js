const fs = require('fs');

const craftItem = (item) => {
  const craftRoll = roll();
  const crafting = true;
  const uvs = [];

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
    while (uv.includes(uvType)) {
      uvType = getUvType(itemType, crafting);
    }
  }
  
  const result = uvType + uvGrade;

  return result;
}

const getUvGrade = (type) => {
  const gradeRoll = roll();
  let result = '\n'

  if (gradeRoll <= 245) {
    type.includes('weapon') ? result += 'Very High' : result += 'Maximum';
  } else if (gradeRoll <= 732) {
    result += 'High';
  } else if (gradeRoll <= 2683) {
    result += 'Medium';
  } else {
    result += 'Low';
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

  if (weapons.includes(item)) {
    result = 'weapon';
  } else if (shield.includes(item)) {
    result = 'shield';
  } else {
    result = 'armor';
  }

  return result;
}

const roll = () => {
  return Math.floor(Math.random() * 10001);
}

const getPunchImage = (match) => {
  const itemList = JSON.parse(fs.readFileSync(`src/data/punch.json`));

  for (const item of itemList) {
    if (match.includes(item.name)) {
      return item.url;
    }
  }
}

module.exports = {
  craftItem,
  rollUv,
  getPunchImage
}