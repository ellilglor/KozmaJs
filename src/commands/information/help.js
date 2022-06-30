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
        `**/bookchance** Get the % chance you have of getting at least 1 Book of Dark Rituals.\n\n` + 
        `**/clear** Deletes all the messages the bot has sent you.\n\n` + 
        `**/convert** Convert your currency. (glorified calculator)\n\n` +
        `**/findlogs** Makes the bot search the database for your item.\n\n` +
        `**/lockbox** Gives information about a lockbox or tells you what box drops your item.\n\n` +
        `**/rate** Tells you the crowns per energy rate currently in use.\n\n` +
        `**/unbox** Simulate opening a box and be disappointed for free.\n\n` +
        `*If you notice a problem please contact @ellilglor#6866!*`);

		await interaction.reply({embeds: [reply], ephemeral: true});
    await logCommand(interaction);
	}
};