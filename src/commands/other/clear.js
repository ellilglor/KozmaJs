const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed, logCommand } = require('../../functions/general');
const fetchAll = require('discord-fetch-all');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Removes all bot messages in your dms.'),
	async execute(interaction) {
    const reply = buildEmbed().setTitle('Clearing messages');
		await interaction.reply({embeds: [reply], ephemeral: true});
    await logCommand(interaction);

    await interaction.user.createDM();
    const channel = interaction.user.dmChannel;
    await fetchAll.messages(channel).then(messages => {
      messages.forEach(message => 
        { if (message.author.bot) { message.delete(); }}
      )
    });
	}
};