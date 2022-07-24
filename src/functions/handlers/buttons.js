const fs = require('fs');

module.exports = (client) => {
  client.handleButtons = async (buttonFolders) => {
    for (const folder of buttonFolders) {
      const buttonFiles = fs.readdirSync(`./src/buttons/${folder}`).filter(f => f.endsWith('.js'));
      for (const file of buttonFiles) {
        const button = require(`../../buttons/${folder}/${file}`);
        client.buttons.set(button.data.name, button);
      }
    }
  }
}