const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
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

    const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setURL('https://github.com/ellilglor/KozmaJs').setLabel('Github').setStyle('Link'),
      new ButtonBuilder()
				.setURL('https://discord.gg/7tX9hxezvZ').setLabel('Discord server').setStyle('Link')
		);
    
		await interaction.reply({ embeds: [reply], components: [buttons], ephemeral: true });
    await logCommand(interaction);
	}
};