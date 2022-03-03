const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed, logCommand } = require('../../functions/general');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Explains all commands.'),
	async execute(interaction) {
    const reply = buildEmbed()
      .setTitle('Here are all my commands:')
      .setDescription(
        `**/clear** Deletes all the messages the bot has sent you.\n\n` + 
        `**/convert** Convert your currency.\n\n` +
        `**/findlogs** Makes the bot search the database for your item.\nA date can be added to make the bot stop looking.\nSpecial searches:\n- color only ~ example: autumn\n\n` +
        `**/lockbox** Gives information about a lockbox or tells you what box drops your item.\n\n` +
        `**/rate** Tells you the crowns per energy rate currently in use.\n\n` +
        `**/unbox** Simulate opening a box and be disappointed for free.\n\n` +
        `*If you notice a problem please contact @ellilglor#6866!*`);

    await logCommand(interaction);
		await interaction.reply({embeds: [reply], ephemeral: true});
	}
};