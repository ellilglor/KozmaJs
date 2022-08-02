const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { buildEmbed, logCommand, getLanguage } = require('@functions/general');
const { globals } = require('@data/variables');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Explains all commands.'),
	async execute(interaction) {
    const lan = getLanguage('temp').help;
    const reply = buildEmbed(interaction)
      .setTitle(lan.title)
      .setDescription(`*${lan.desc} @${globals.ownerTag}*`)
      .addFields([
        { name: '/bookchance', value: lan.bookChance },
        { name: '/clear', value: lan.clear },
        { name: '/convert', value: lan.convert },
        { name: '/findlogs', value: lan.findLogs },
        { name: '/lockbox', value: lan.lockbox },
        { name: '/rate', value: lan.rate },
        { name: '/unbox', value: lan.unbox },
    ]);

    const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setURL(globals.github).setLabel('Github').setStyle('Link'),
      new ButtonBuilder()
				.setURL(globals.serverInvite).setLabel('Discord server').setStyle('Link')
		);
    
		await interaction.reply({ embeds: [reply], components: [buttons], ephemeral: true });
    await logCommand(interaction);
	}
};