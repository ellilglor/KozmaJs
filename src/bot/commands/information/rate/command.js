const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('@utils/functions');
const dbRepo = require('@database/repos/dbRepo');
const { statTypes } = require('@database/repos/types');
const { globals } = require('@utils/variables');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rate')
		.setDescription('View the current crowns per energy rate used for /convert.')
    .addIntegerOption(option =>
		  option.setName('value')
			.setDescription('Update the used exchange rate.')),
	async execute(interaction) {
    const newValue = interaction.options.getInteger('value');
    const reply = buildEmbed(interaction).setDescription('I use this rate for calculating **/convert**.');

    if (newValue) {
      if (interaction.member?.roles.cache.some(r => r.id === globals.adminId || r.id === globals.modId)) {
        await dbRepo.saveToDb(statTypes.rate, newValue);
        reply.setTitle(`The conversion rate has been changed to: ${newValue}.`);
      } else { 
        reply.setTitle(`You don't have permission to set a new rate!`).setColor('#e74c3c');;
      }
    } else {
      const rate = await dbRepo.getMarketRate();
      reply.setTitle(`The current crowns per energy rate is: ${rate}.`);
    }
    
    await interaction.editReply({ embeds: [reply] });
    await logCommand(interaction);
	}
};