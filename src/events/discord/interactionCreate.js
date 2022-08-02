const { InteractionType: type } = require('discord.js');
const { buildEmbed, getLanguage } = require('@functions/general');
const { globals } = require('@data/variables');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
    if (interaction.type !== type.ApplicationCommand && interaction.type !== type.MessageComponent) return;

    // if (interaction.user.tag !== globals.ownerTag) {
    //   const maintenance = buildEmbed(interaction).setTitle('The bot is currently being worked on.\nPlease try again later.');
    //   interaction.reply({embeds: [maintenance], ephemeral: true});
    //   console.log(interaction.user.tag);
    //   return;
    // }

    const lan = getLanguage('temp').error;
    const command = client.commands.get(interaction.commandName);
    const button = client.buttons.get(interaction.customId);
    const noCode = buildEmbed(interaction).setTitle(lan.missing);

    if (!command && !button) return await interaction.reply({ embeds: [noCode], ephemeral: true });
    
    try {
      command ? await command.execute(interaction) : await button.execute(interaction);
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