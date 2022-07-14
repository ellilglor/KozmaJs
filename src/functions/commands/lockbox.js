const { boxes, slimeBoxes } = require('../../data/structures/lockbox');

const findBox = (name) => {
  return boxes.get(name);
};

const findSlimeBox = (name) => {
  return slimeBoxes.get(name.toLowerCase());
};

const findItem = (item) => {
  let result = "";
  item = item.replace(/['"\+\[\]()\-{},]/g,"").toLowerCase();

  boxes.forEach ((value, key) => {
    if (!value.toLowerCase().replace(/['"\+\[\]()\-{},]/g,"").includes(item)) return;
    
    result += `\n\n__**${key.toUpperCase()} LOCKBOX:**__\n`;

    if (key === 'Iron') {
      const pools = value.replace(/['"\+\[\]()\-{},]/g,"").split('80%');
      result += pools[0].toLowerCase().includes(item) ? '**Inside 20% pool:**\n' : '**Inside 80% pool:**\n';
    }

    const lines = value.split('\n');
    for (const line of lines) {
      if (line.replace(/['"\+\[\]()\-{},]/g,"").toLowerCase().includes(item)) result += `${line}\n`;
    }
  });

  return result;
};

module.exports = {
  findBox,
  findSlimeBox,
  findItem
};