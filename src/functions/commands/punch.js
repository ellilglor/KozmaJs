const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { memes } = require('@structures/punch');
const { globals } = require('@data/variables');

const players = {};

const setPlayer = ({ user: { id } }, item) => {
  if (!players[id]) players[id] = {};
  players[id][item] = {};
}

const updatePlayer = ({ user: { id } }, item, uv) => {
  if (!players[id]) players[id] = {}; 
  if (!players[id][item]) players[id][item] = {};
  if (!players[id][item]['types']) players[id][item]['types'] = {};
  if (!players[id][item]['grades']) players[id][item]['grades'] = {};

  const [type, grade] = uv.replace(':', '').split('\n');

  players[id][item]['types'][type] = players[id][item]['types'][type] + 1 || 1;
  players[id][item]['grades'][grade] = players[id][item]['grades'][grade] + 1 || 1;
}

const getPlayer = ({ user: { id } }, embed) => {
  if (!players[id]) return embed.setDescription('The bot has restarted and this data is lost!');
  if (!players[id][embed.data.title]['types']) return embed.setDescription('You have not rolled anything this session.');
  
  let typeDesc = '**In this session you rolled:**', gradeDesc = '\n\n**And got these grades:**\n';
  let uvTypes = players[id][embed.data.title]['types'], uvGrades = players[id][embed.data.title]['grades'];
  // sort uvs from most to least rolled
  uvTypes = Object.fromEntries(Object.entries(uvTypes).sort(([,a],[,b]) => b-a));
  uvGrades = Object.fromEntries(Object.entries(uvGrades).sort(([,a],[,b]) => b-a));

  Object.entries(uvTypes).forEach(([type, amount]) => typeDesc = typeDesc.concat('\n', `${type} : ${amount}`));
  Object.entries(uvGrades).forEach(([grade, amount]) => gradeDesc = gradeDesc.concat(' - ', `${grade} : ${amount}`));

  return embed.setDescription(typeDesc.concat(gradeDesc.replace('-', '')));
}

const craftItem = (type) => {
  const craftRoll = roll();
  const uvs = [], crafting = true;

  if (craftRoll <= 10) {
    for (let i=1; i <= 3; i++) {
      uvs.push(rollUv(type, crafting, uvs));
    }
  } else if (craftRoll <= 100) {
    for (let i=1; i <= 2; i++) {
      uvs.push(rollUv(type, crafting, uvs));
    }
  } else if (craftRoll <= 1000) {
    uvs.push(rollUv(type, crafting, uvs));
  }

  return uvs;
}

const rollUv = (itemType, crafting, uvs) => {
  const uvGrade = getUvGrade(itemType);
  let uvType = getUvType(itemType, crafting);

  switch (uvs.length) {
    case 2:
      while (uvs[0].includes(uvType) || uvs[1].includes(uvType)) {
        uvType = getUvType(itemType, crafting);
      }
      break;
    case 1:
      while (uvs[0].includes(uvType)) {
        uvType = getUvType(itemType, crafting);
      }
  }

  return uvType + uvGrade;
}

const getUvGrade = (type) => {
  const gradeRoll = roll();
  let result = '\n';

  if (gradeRoll <= 245) {
    result += type === 'Weapon' || type === 'Bomb' ? 'Very High' : 'Maximum';
  } else {
    result += gradeRoll <= 732 ? 'High' : gradeRoll <= 2683 ? 'Medium' : 'Low';
  } 

  return result;
}

const getUvType = (type, crafting) => {
  if (type === 'Weapon' || type === 'Bomb') {
    const num = type === 'Weapon' ? 8 : 7;
    const weaponRoll = Math.floor(Math.random() * num);
    
    switch (weaponRoll) {
      case 0: result = 'Damage Bonus vs Undead:'; break;
      case 1: result = 'Damage Bonus vs Slime:'; break;
      case 2: result = 'Damage Bonus vs Construct:'; break;
      case 3: result = 'Damage Bonus vs Gremlin:'; break;
      case 4: result = 'Damage Bonus vs Fiend:'; break;
      case 5: result = 'Damage Bonus vs Beast:'; break;
      case 6: result = 'Charge Time Reduction:'; break;
      case 7: result = 'Attack Speed Increase:';
    }
  } else {
    const num = type === 'Armor' || (type === 'Shield' && crafting) ? 11 : 4;
    const armorRoll = Math.floor(Math.random() * num);
    
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

const roll = () => {
  return Math.floor(Math.random() * 10001);
}

const lockUv = async (interaction, uv) => {
  const embed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(null);
  const lockButtons = ActionRowBuilder.from(interaction.message.components[0]);
  const gambleButtons = ActionRowBuilder.from(interaction.message.components[1]);
  let lockCount = 0;

  embed.data.fields[uv - 1].name = embed.data.fields[uv - 1].name.includes('🔒') ? `🔓 UV #${uv}` : `🔒 UV #${uv}`;

  embed.data.fields.forEach(f => { if (f.name.includes('🔒')) lockCount += 1 });

  switch (lockCount) {
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
  const pos = Math.floor(Math.random() * memes.length);

  embed.setDescription(
    'Congratulations! You created a GM item.\n' +
    'As a reward you get a random Spiral Knights meme.\n' +
    `Author: ${memes[pos].author}`);
  embed.setImage(memes[pos].url);
  
  return embed;
}

const logGambler = ({ user }, ticket) => {
  if (user.tag === globals.ownerTag) return;

  console.log(`${user.tag} spent ${ticket.toLocaleString('en')} Crowns at Punch`);
}

const logCrafter = ({ user }, item) => {
  if (user.tag === globals.ownerTag) return;

  console.log(`${user.tag} recrafted: ${item}`);
}

module.exports = {
  setPlayer,
  updatePlayer,
  getPlayer,
  craftItem,
  rollUv,
  lockUv,
  checkForGm,
  logGambler,
  logCrafter
}