const { InteractionType } = require('discord.js');
const { buildEmbed } = require('../../functions/general');

const noCode = buildEmbed().setTitle('It looks like something went wrong!');
const crashed = buildEmbed()
  .setTitle('There was an error while executing this command!')
  .setDescription('@ellilglor#6866 has been notified.');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
    if (interaction.type !== InteractionType.ApplicationCommand && !interaction.isButton()) return;

    // if (interaction.user.tag !== 'ellilglor#6866') {
    //   const maintenance = buildEmbed().setTitle('The bot is currently being worked on.\nPlease try again later.');
    //   interaction.reply({embeds: [maintenance], ephemeral: true});
    //   console.log(interaction.user.tag);
    //   return;
    // }
    
    const command = client.commands.get(interaction.commandName);
    const button = client.buttons.get(interaction.customId);

    if (!command && !button) return await interaction.reply({ embeds: [noCode], ephemeral: true });
    
    try {
      await command ? command.execute(interaction) : button.execute(interaction);
    } catch (error) {
      const logChannel = client.channels.cache.get(process.env.botLogs);
      const name = interaction.commandName || interaction.customId;
      await logChannel.send(`<@214787913097936896> Error while executing ${name} for ${interaction.user.tag}!\n${error}`);
      console.log(`Error while executing ${name}!`, { error });

      const message = { embeds: [crashed], ephemeral: true };
      await interaction.reply ? interaction.editReply(message) : interaction.reply(message);
    };
	},
};