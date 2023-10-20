const { globals } = require('@utils/variables');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('fs');

const deployCommands = async (globalCommands, kozmaCommands) => {
  const rest = new REST({ version: '10' }).setToken(process.env.botToken);

  try {
    console.log('Started refreshing application (/) commands.');
    
    //await rest.put(Routes.applicationCommands(globals.botId), { body: globalCommands });

    await rest.put(Routes.applicationGuildCommands(globals.botId, globals.serverId), { body: kozmaCommands });

    //unregister guild commands
    // rest.get(Routes.applicationGuildCommands(globals.botId, globals.serverId))
    // .then(data => {
    //   const promises = [];
    //   for (const command of data) {
    //     const deleteUrl = `${Routes.applicationGuildCommands(globals.botId, globals.serverId)}/${command.id}`;
    //     promises.push(rest.delete(deleteUrl));
    //   }
    //   return Promise.all(promises);
    // });

    //unregister global commands
    // rest.get(Routes.applicationCommands(globals.botId))
    // .then(data => {
    //   const promises = [];
    //   for (const command of data) {
    //     const deleteUrl = `${Routes.applicationCommands(globals.botId)}/${command.id}`;
    //     promises.push(rest.delete(deleteUrl));
    //   }
    //   return Promise.all(promises);
    // });
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.log(error);
  }
}

module.exports = (client) => {
  client.handleCommands = async () => {
    const globalCommands = [], kozmaCommands = [];
    const path = './src/bot/commands';

    fs.readdirSync(path).forEach(group => {
      fs.readdirSync(`${path}/${group}`).forEach(cmd => {
        const command = require(`@commands/${group}/${cmd}/command.js`);
        client.commands.set(command.data.name, command);

        switch (cmd) {
          case 'kbp': kozmaCommands.push(command.data.toJSON()); break;
          default: globalCommands.push(command.data.toJSON());
        }

        if (!fs.existsSync(`${path}/${group}/${cmd}/components`)) return;
        
        fs.readdirSync(`${path}/${group}/${cmd}/components`).forEach(folder => {
          fs.readdirSync(`${path}/${group}/${cmd}/components/${folder}`).filter(f => f.endsWith('.js'))
            .forEach(file => {
              const component = require(`@commands/${group}/${cmd}/components/${folder}/${file}`);

              switch (folder) {
                case 'buttons': client.buttons.set(component.data.name, component); break;
                case 'modals': client.modals.set(component.data.name, component); break;
              }
            });
        });
      });
    });

    //await deployCommands(globalCommands, kozmaCommands);
  }
}