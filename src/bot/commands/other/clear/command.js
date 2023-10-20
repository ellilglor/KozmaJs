const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('@utils/functions');
const fetchAll = require('discord-fetch-all');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Removes all bot messages in your dms.'),
	async execute(interaction) {
    const reply = buildEmbed(interaction).setTitle('Clearing messages.');
    interaction.commandName = 'clear'; //needed for proper logging when command is ran through the button
    
		await interaction.editReply({ embeds: [reply], components: [] });
    await logCommand(interaction);

    await interaction.user.createDM();
    const channel = interaction.user.dmChannel;
    await fetchAll.messages(channel).then(messages => {
      messages.forEach(msg => { if (msg.author.bot) msg.delete().catch(err => 
        { console.log('An error occurred but the bot is still running') })});
    });
	}
};