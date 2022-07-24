const { boxes, slimeBoxes } = require('../../data/structures/lockbox');

const findBox = (name) => {
  return boxes.get(name);
};

const findSlimeBox = (name) => {
  return slimeBoxes.get(name.toLowerCase());
};

const findItem = (item) => {
  const replace = /['"\+\[\]()\-{},]/g;
  let result = "";
  item = item.replace(replace,"").toLowerCase();

  boxes.forEach ((value, key) => {
    if (!value.toLowerCase().replace(replace,"").includes(item)) return;
    
    result += `\n\n__**${key.toUpperCase()} LOCKBOX:**__\n`;

    if (key === 'Iron') {
      const pools = value.replace(replace,"").toLowerCase().split('80%');
      result += pools[0].includes(item) ? '**Inside 20% pool:**\n' : '**Inside 80% pool:**\n';
    }

    const lines = value.split('\n');
    lines.forEach(line => {
      if (line.replace(replace,"").toLowerCase().includes(item)) result += `${line}\n`;
    });
  });

  return result;
};

module.exports = {
  findBox,
  findSlimeBox,
  findItem
};