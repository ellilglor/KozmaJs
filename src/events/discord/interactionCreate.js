const { InteractionType: type } = require('discord.js');
const { buildEmbed, getLanguage } = require('@functions/general');
const { globals } = require('@data/variables');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
    const lan = getLanguage('temp').error;
    const noCode = buildEmbed(interaction).setTitle(lan.missing);
    
    // if (interaction.user.tag !== globals.ownerTag) {
    //   const maintenance = buildEmbed(interaction).setTitle('The bot is currently being worked on.\nPlease try again later.');
    //   interaction.reply({embeds: [maintenance], ephemeral: true});
    //   console.log(interaction.user.tag);
    //   return;
    // }
    
    try {
      switch (interaction.type) {
        case type.ApplicationCommand:
          const command = client.commands.get(interaction.commandName);
          if (!command) return await interaction.reply({ embeds: [noCode], ephemeral: true });
          await command.execute(interaction); break;
        case type.MessageComponent:
          const button = client.buttons.get(interaction.customId);
          if (!button) return await interaction.reply({ embeds: [noCode], ephemeral: true });
          await button.execute(interaction); break;
        case type.ModalSubmit:
          const modal = client.modals.get(interaction.customId);
          if (!modal) return await interaction.reply({ embeds: [noCode], ephemeral: true });
          await modal.execute(interaction); break;
        default: 
          return await interaction.reply({ embeds: [noCode], ephemeral: true });
      }
    } catch (error) {
      const logChannel = client.channels.cache.get(globals.botLogsChannelId);
      const name = interaction.commandName || interaction.customId;
      const crashed = buildEmbed(interaction).setTitle(lan.error).setDescription(`@${globals.ownerTag} ${lan.notified}`);
      
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