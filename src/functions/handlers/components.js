const fs = require('fs');

module.exports = (client) => {
  client.handleComponents = async (componentFolders) => {
    const { buttons, modals } = client;
    
    for (const folder of componentFolders) {
      const componentTypeFolder = fs.readdirSync(`./src/components/${folder}`);
      for (const subFolder of componentTypeFolder) {
        const files = fs.readdirSync(`./src/components/${folder}/${subFolder}`).filter(f => f.endsWith('.js'));
        for (const file of files) {
          const component = require(`@components/${folder}/${subFolder}/${file}`);
          switch (folder) {
            case 'buttons': buttons.set(component.data.name, component); break;
            case 'modals': modals.set(component.data.name, component); break;
          }
        }
      }  
    }
  }
}
