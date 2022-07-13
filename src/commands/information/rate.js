const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed, noPermission, logCommand } = require('../../functions/general');
const { saveRate, getRate } = require('../../functions/database/rate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rate')
		.setDescription('View or update the current crowns per energy rate.')
    .addIntegerOption(option =>
		  option.setName('value')
			.setDescription('Update the used exchange rate.')),
	async execute(interaction) {
    const newValue = interaction.options.getInteger('value');
    let reply = buildEmbed();

    if (newValue) {
      if (interaction.member?.roles.cache.has('760222967808131092') || interaction.member?.roles.cache.has('796399775959220304')) {
        await saveRate(newValue);
        reply.setTitle(`The conversion rate has been changed to: ${newValue}.`);
      } else { 
        reply = noPermission(reply);
      }
    } else {
      const rate = await getRate();
      reply
        .setTitle(`The current crowns per energy rate is: ${rate}.`)
        .setDescription('I use this rate for calculating **/convert**.');
    }
    
    await interaction.reply({ embeds: [reply], ephemeral: true });
    await logCommand(interaction);
	}
};