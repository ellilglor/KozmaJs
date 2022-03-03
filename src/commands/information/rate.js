const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed, noPermission, logCommand } = require('../../functions/general');
const fs = require('fs');

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
    await logCommand(interaction);

    if (newValue) {
      if (interaction.member && (interaction.member.roles.cache.has('760222967808131092') || interaction.member.roles.cache.has('796399775959220304'))) {
        fs.writeFileSync('src/data/rate.json', JSON.stringify([{rate : newValue}]));
        reply.setTitle(`The conversion rate has been changed to: ${newValue}.`);
      } else { reply = noPermission(reply) }
    } else {
      const rate = JSON.parse(fs.readFileSync('src/data/rate.json'))[0].rate
      reply.setTitle(`The current crowns per energy rate is: ${rate}.`)
      .setDescription('We use this rate for calculating **/convert**.');
    }
    
    await interaction.reply({embeds: [reply], ephemeral: true});
	}
};