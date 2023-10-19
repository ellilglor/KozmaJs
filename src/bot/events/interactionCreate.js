const { InteractionType: type } = require('discord.js');
const { buildEmbed } = require('@functions/general');
const { globals } = require('@data/variables');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
    // if (interaction.user.id !== globals.ownerId) {
    //   const maintenance = buildEmbed(interaction).setTitle('The bot is currently being worked on.\nPlease try again later.');
    //   interaction.reply({ embeds: [maintenance], ephemeral: true });
    //   return console.log(interaction.user.tag);
    // }
    
    try {
      const noCode = buildEmbed(interaction).setTitle('It looks like this command is missing!');
      
      switch (interaction.type) {
        case type.ApplicationCommand: 
          const defer = await interaction.deferReply({ ephemeral: true, fetchReply: true });
          const command = client.commands.get(interaction.commandName);
          
          if (!command) return await interaction.editReply({ embeds: [noCode], ephemeral: true });

          if (interaction.guildId !== globals.serverId && interaction.user.id !== globals.ownerId) {
            try {
              const guild = await interaction.client.guilds.fetch(globals.serverId);
              await guild.bans.fetch(interaction.user.id);
              const banned = buildEmbed(interaction).setTitle(`You are banned from the Kozma's Backpack Discord server and are therefore prohibited from using this bot.`);
              return await interaction.editReply({ embeds: [banned], ephemeral: true });
            } catch (_) {
              // catches when user is not banned -> command can run
            }
          }
          
          await command.execute(interaction, defer); break;
        case type.MessageComponent: 
          await interaction.deferUpdate();
          const button = client.buttons.get(interaction.customId);
          if (!button) return await interaction.editReply({ embeds: [noCode], ephemeral: true });
          await button.execute(interaction); break;
        default: return await interaction.reply({ embeds: [noCode], ephemeral: true });
      }
    } catch (error) {
      const logChannel = client.channels.cache.get(globals.botLogsChannelId);
      const name = interaction.commandName || interaction.customId;
      const crashed = buildEmbed(interaction)
        .setTitle('There was an error while executing this command!')
        .setDescription(`<@${globals.ownerId}> has been notified.`);
      
      console.log(`\u001b[31mError while executing ${name}!\n\u001b[0m`, { error });

      //unknown interaction error happens randomly
      if (error.name !== 'DiscordAPIError[10062]') {
        await logChannel.send(`<@${globals.ownerId}> Error while executing ${name} for ${interaction.user.tag}!\n${error}`);
        const message = { embeds: [crashed], ephemeral: true };
        interaction.replied || interaction.deferred ? await interaction.editReply(message) : await interaction.reply(message);
      }
    };
	},
};