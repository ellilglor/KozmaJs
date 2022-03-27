const fs = require('fs');

const unbox = (box) => {
  const content = JSON.parse(fs.readFileSync(`src/data/boxes/${box}.json`));
  const roll = Math.random() * 100;
  const result = [content[0].name];
  let prevOdds = 0;

  for (const item of content) {
    if ((prevOdds <= roll) && (roll < prevOdds + item.chance)) {
      result.splice(0, result.length);
      result.push(item.name)
      if (bonusBoxes.includes(box)) {
        //item.name += bonusRoll(box, content, roll, item.name);
        const bonusItem = bonusRoll(box, content, roll, item.name);
        if (bonusItem) { result.push(bonusItem)}
      }
      //return item.name;
      return result
    }
    prevOdds += item.chance;
  }

  return result
}

const bonusRoll = (box, content, roll, unboxed) => {
  let result = '';
  
  if (box.includes('Confection')) {
    const bRoll = Math.random() * 100;
    if (bRoll <= 1) { result = 'Sprinkle Aura'; }
  } else if (box.includes('Lucky') && roll <= 32) {
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
            result = item.name;
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

const getImage = (box, match) => {
  const content = JSON.parse(fs.readFileSync(`src/data/boxes/${box}.json`));

  for (const item of content) {
    if (match.includes(item.name)) {
      return item.url;
    }
  }

  return noImage(match);
}

const noImage = (match) => {
  console.log(`no image found for ${match}`);
  return 'https://media3.spiralknights.com/wiki-images/8/82/Icon-alert.png';
}

const bonusBoxes = ['Confection', 'Lucky'];

module.exports = {
  unbox,
  getImage
}