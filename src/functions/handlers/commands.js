const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { globals } = require('../../data/variables');
const fs = require('fs');

const deployCommands = async (globalCommands, kozmaCommands) => {
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(globals.botId),
      { body: globalCommands },
    );

    // await rest.put(
    //   Routes.applicationGuildCommands(globals.botId, globals.serverId),
    //   { body: kozmaCommands }
    // )

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
  client.handleCommands = async (commandFolders) => {
    const globalCommands = [], kozmaCommands = [];
    
    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(f => f.endsWith('.js'));
      for (const file of commandFiles) {
	      const command = require(`../../commands/${folder}/${file}`);
	      client.commands.set(command.data.name, command);

        if (folder.includes('kbp')) {
          kozmaCommands.push(command.data.toJSON());
        } else {
          globalCommands.push(command.data.toJSON());
        }
      }
    }

    //await deployCommands(globalCommands, kozmaCommands);
  }
}