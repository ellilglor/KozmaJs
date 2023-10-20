const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('@functions/general');
const { saveRate, getRate } = require('@database/functions/rate');
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
        await saveRate(newValue);
        reply.setTitle(`The conversion rate has been changed to: ${newValue}.`);
      } else { 
        reply.setTitle(`You don't have permission to set a new rate!`).setColor('#e74c3c');;
      }
    } else {
      const rate = await getRate();
      reply.setTitle(`The current crowns per energy rate is: ${rate}.`);
    }
    
    await interaction.editReply({ embeds: [reply] });
    await logCommand(interaction);
	}
};