const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const clientId = '898505614404235266';
const guildId = '760222722919497820';

const globalCommands = [];
const kozmaCommands = [];

const deployCommands = async (globalCommands, kozmaCommands) => {
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: globalCommands },
    );

    // await rest.put(
    //   Routes.applicationGuildCommands(clientId, guildId),
    //   { body: kozmaCommands }
    // )

    //unregister guild commands
    // rest.get(Routes.applicationGuildCommands(clientId, guildId))
    // .then(data => {
    //   const promises = [];
    //   for (const command of data) {
    //     const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
    //     promises.push(rest.delete(deleteUrl));
    //   }
    //   return Promise.all(promises);
    // });

    //unregister global commands
    // rest.get(Routes.applicationCommands(clientId))
    // .then(data => {
    //   const promises = [];
    //   for (const command of data) {
    //     const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`;
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
    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
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