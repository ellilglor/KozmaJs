const { boxes, slimeBoxes } = require('../data/lockboxData');

const findBox = (name) => {
  return boxes.get(name);
};

const findSlimeBox = (name) => {
  return slimeBoxes.get(name.toLowerCase());
};

const findItem = (item) => {
  const replace = /['"\+\[\]()\-{},]/g;
  let boxOdds = '';
  
  item = item.replace(replace,"").toLowerCase();

  boxes.forEach((content, box) => {
    if (!content.toLowerCase().replace(replace,"").includes(item)) return;

    boxOdds += `\n\n__**${box.toUpperCase()} LOCKBOX:**__\n`;

    if (box === 'Iron') {
      const pools = content.replace(replace,"").toLowerCase().split('80%');
      boxOdds += pools[0].includes(item) ? '**Inside 20% pool:**\n' : '**Inside 80% pool:**\n';
    }

    const lines = content.split('\n');
    lines.forEach(l => { if (l.replace(replace,"").toLowerCase().includes(item)) boxOdds += `${l}\n` });
  });

  return boxOdds;
};

module.exports = {
  findBox,
  findSlimeBox,
  findItem
};