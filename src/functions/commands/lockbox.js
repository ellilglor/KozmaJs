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

  boxes.forEach((content, box) => {
    if (!content.toLowerCase().replace(replace,"").includes(item)) return;
    
    result += `\n\n__**${box.toUpperCase()} LOCKBOX:**__\n`;

    if (box === 'Iron') {
      const pools = content.replace(replace,"").toLowerCase().split('80%');
      result += pools[0].includes(item) ? '**Inside 20% pool:**\n' : '**Inside 80% pool:**\n';
    }

    const lines = content.split('\n');
    lines.forEach(l => { if (l.replace(replace,"").toLowerCase().includes(item)) result += `${l}\n` });
  });

  return result;
};

module.exports = {
  findBox,
  findSlimeBox,
  findItem
};