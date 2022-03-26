const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed } = require('../../functions/general');
const { checkOldMessages } = require('../../functions/moderation/kbpTradeMute')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultPermission(false),
	async execute(interaction) {
	  //if (interaction.channel.id === '879297439054581770') { return }
    const reply = buildEmbed().setTitle('Currently not in use.');
    await interaction.deferReply({ephemeral: true});

	  await interaction.editReply({embeds: [reply]});
	}
};