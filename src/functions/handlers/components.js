const fs = require('fs');

// module.exports = (client) => {
//   client.handleButtons = async (buttonFolders) => {
//     for (const folder of buttonFolders) {
//       const buttonFiles = fs.readdirSync(`./src/buttons/${folder}`).filter(f => f.endsWith('.js'));
//       for (const file of buttonFiles) {
//         const button = require(`../../buttons/${folder}/${file}`);
//         client.buttons.set(button.data.name, button);
//       }
//     }
//   }
// }
module.exports = (client) => {
  client.handleComponents = async (componentFolders) => {
    const { buttons, modals } = client;
    
    for (const componentFolder of componentFolders) {
      const componentTypeFolder = fs.readdirSync(`./src/components/${componentFolder}`);

      for (const folder of componentTypeFolder) {
        const componentFiles = fs.readdirSync(`./src/components/${componentFolder}/${folder}`).filter(f => f.endsWith('.js'));

        for (const file of componentFiles) {
          const component = require(`@components/${componentFolder}/${folder}/${file}`);

          switch (componentFolder) {
            case 'buttons': buttons.set(component.data.name, component); break;
            case 'modals': modals.set(component.data.name, component); break;
          }
        }
      }  
    }
  }
}