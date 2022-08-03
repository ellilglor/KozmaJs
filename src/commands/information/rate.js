const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand, getLanguage } = require('@functions/general');
const { saveRate, getRate } = require('@functions/database/rate');
const { globals } = require('@data/variables');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rate')
		.setDescription('View or update the current crowns per energy rate.')
    .addIntegerOption(option =>
		  option.setName('value')
			.setDescription('Update the used exchange rate.')),
	async execute(interaction) {
    const lan = getLanguage('temp').rate;
    const newValue = interaction.options.getInteger('value');
    const reply = buildEmbed(interaction).setDescription(lan.desc);

    if (newValue) {
      if (interaction.member?.roles.cache.some(r => r.id === globals.adminId || r.id === globals.modId)) {
        await saveRate(newValue);
        reply.setTitle(`The conversion rate has been changed to: ${newValue}.`);
      } else { 
        reply.setTitle(lan.noPerm).setColor('#e74c3c');;
      }
    } else {
      const rate = await getRate();
      reply.setTitle(`${lan.rate} ${rate}.`);
    }
    
    await interaction.reply({ embeds: [reply], ephemeral: true });
    await logCommand(interaction);
	}
};