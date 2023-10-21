const fs = require('fs');

const unbox = (box) => {
  const content = JSON.parse(fs.readFileSync(`./src/bot/commands/games/unbox/data/boxes/${box}.json`));
  const bonusBoxes = ['Confection', 'Lucky'];
  const roll = Math.random() * 100;
  const unboxed = [content[0]];
  let prevOdds = 0;

  for (const item of content) {
    if ((prevOdds <= roll) && (roll < prevOdds + item.chance)) {
      unboxed.splice(0, unboxed.length);
      unboxed.push(item)
      if (bonusBoxes.includes(box)) {
        const bonusItem = bonusRoll(box, content, roll, item.name);
        if (bonusItem) unboxed.push(bonusItem);
      }
      return unboxed;
    }
    prevOdds += item.chance;
  }

  return unboxed;
}

const bonusRoll = (box, content, roll, unboxed) => {
  let bonus = '';
  
  if (box === 'Confection') {
    const bRoll = Math.random() * 100;
    if (bRoll <= 1) bonus = { name: 'Sprinkle Aura' };
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
            bonus = item;
            finished = true;
            break bonusRollLoop;
          }
        }
        prevOdds += item.chance;
      }
    }
  }

  return bonus;
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
  calculateCost
}