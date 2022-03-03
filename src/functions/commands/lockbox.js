const { boxes, slimeBoxes } = require('../../data/structures/lockbox');

const findBox = (name) => {
  const result = boxes.get(name);
  return result;
};

const findSlimeBox = (name) => {
  const result = slimeBoxes.get(name.toLowerCase());
  return result;
};

const findItem = (item) => {
  let result = "";
  item = item.replace(/['"\+\[\]()\-{},]/g,"").toLowerCase();

  boxes.forEach (function(value, key) {
    if (!value.toLowerCase().replace(/['"\+\[\]()\-{},]/g,"").includes(item)) {
      return;
    }
    
    result += `\n\n__**${key.toUpperCase()} LOCKBOX:**__\n`;

    if (key === 'Iron') {
      const pools = value.replace(/['"\+\[\]()\-{},]/g,"").split('80%');
      if (pools[0].toLowerCase().includes(item)) {
        result += '**Inside 20% pool:**\n';
      } else {
        result += '**Inside 80% pool:**\n';
      }
    }

    const lines = value.split('\n');
    for (const line of lines) {
      if (line.replace(/['"\+\[\]()\-{},]/g,"").toLowerCase().includes(item)) {
        result += `${line}\n`;
      }
    }
  });

  return result;
};

module.exports = {
  findBox,
  findSlimeBox,
  findItem
};