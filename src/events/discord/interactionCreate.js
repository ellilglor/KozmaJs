const { InteractionType: type } = require('discord.js');
const { buildEmbed } = require('@functions/general');
const { globals } = require('@data/variables');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
    const noCode = buildEmbed(interaction).setTitle('It looks like this command is missing!');
    
    // if (interaction.user.tag !== globals.ownerTag) {
    //   const maintenance = buildEmbed(interaction).setTitle('The bot is currently being worked on.\nPlease try again later.');
    //   interaction.reply({ embeds: [maintenance], ephemeral: true });
    //   return console.log(interaction.user.tag);
    // }

    if (interaction.type === type.ApplicationCommand && interaction.user.tag !== globals.ownerTag) {
      try {
        const guild = await interaction.client.guilds.fetch(globals.serverId);
        await guild.bans.fetch(interaction.user.id);
        const banned = buildEmbed(interaction).setTitle(`You are banned from the Kozma's Backpack Discord server and are therefore prohibited from using this bot.`);
        return await interaction.reply({ embeds: [banned], ephemeral: true });
      } catch (_) {
        // catches when user is not banned -> command can run
      }
    }
    
    try {
      switch (interaction.type) {
        case type.ApplicationCommand: code = client.commands.get(interaction.commandName); break;
        case type.MessageComponent: code = client.buttons.get(interaction.customId); break;
        case type.ModalSubmit: code = client.modals.get(interaction.customId); break;
        default: return await interaction.reply({ embeds: [noCode], ephemeral: true });
      }

      if (!code) return await interaction.reply({ embeds: [noCode], ephemeral: true });
      await code.execute(interaction);
    } catch (error) {
      const logChannel = client.channels.cache.get(globals.botLogsChannelId);
      const name = interaction.commandName || interaction.customId;
      const crashed = buildEmbed(interaction)
        .setTitle('There was an error while executing this command!')
        .setDescription(`@${globals.ownerTag} has been notified.`);
      
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