const fs = require('fs');

const unbox = (box) => {
  const content = JSON.parse(fs.readFileSync(`src/data/boxes/${box}.json`));
  const bonusBoxes = ['Confection', 'Lucky'];
  const roll = Math.random() * 100;
  const result = [content[0]];
  let prevOdds = 0;

  for (const item of content) {
    if ((prevOdds <= roll) && (roll < prevOdds + item.chance)) {
      result.splice(0, result.length);
      result.push(item)
      if (bonusBoxes.includes(box)) {
        const bonusItem = bonusRoll(box, content, roll, item.name);
        if (bonusItem) result.push(bonusItem);
      }
      return result;
    }
    prevOdds += item.chance;
  }

  return result;
}

const bonusRoll = (box, content, roll, unboxed) => {
  let result = '';
  
  if (box === 'Confection') {
    const bRoll = Math.random() * 100;
    if (bRoll <= 1) result = { name: 'Sprinkle Aura' };
  } else if (box === 'Lucky' && roll <= 32) {
    let finished = false;
    while (!finished) {
      const bRoll = Math.random() * 32;
      
      let prevOdds = 0;
      bonusRollLoop:
      for (const item of content) {
        if ((prevOdds <= bRoll) && (bRoll < prevOdds + item.chance)) {
          if (unboxed.includes(item.name)) {
            break bonusRollLoop;
          } else {
            result = item;
            finished = true;
            break bonusRollLoop;
          }
        }
        prevOdds += item.chance;
      }
    }
  }

  return result;
}

const getImage = (box, item) => {
  const content = JSON.parse(fs.readFileSync(`src/data/boxes/${box}.json`));
  
  return result = content.find(i => item.includes(i.name)).url;
}

const calculateCost = (amount) => {
  let cost = 0;

  const amount14Batches = Math.floor(amount / 14);
  cost += amount14Batches * 49.95;

  const amount5Batches = Math.floor((amount - 14 * amount14Batches) / 5);
  cost += amount5Batches * 19.95;

  const extra = Math.floor(amount - 14 * amount14Batches - 5 * amount5Batches);
  cost += extra * 4.95;

  return cost.toFixed(2);
}

module.exports = {
  unbox,
  getImage,
  calculateCost
}