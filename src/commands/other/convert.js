const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed, logCommand } = require('../../functions/general');
const { getRate } = require('../../functions/database/rate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('Convert crowns or energy.')
    .addStringOption(option =>
		  option.setName('currency')
			.setDescription('Currency you want to convert.')
      .addChoice('Crowns', 'crowns')
      .addChoice('Energy', 'energy')
      .setRequired(true))
   .addIntegerOption(option =>
		  option.setName('amount')
			.setDescription('Amount you want to convert.')
      .setMinValue(1000)
			.setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const currency = interaction.options.getString('currency');
    const rate = await getRate();
    const reply = buildEmbed().setDescription(`used conversion rate: **${rate}** crowns per energy`);

    if (currency === 'crowns') {
      const converted = parseInt(amount/parseInt(rate)).toLocaleString('en');
      reply.setTitle(`${amount.toLocaleString('en')} Crowns is equal to roughly ${converted} Energy.`).setColor('#f9d49c');
    } else {
      const converted = parseInt(amount*parseInt(rate)).toLocaleString('en');
      reply.setTitle(`${amount.toLocaleString('en')} Energy is equal to roughly ${converted} Crowns.`);
    }
    
    await interaction.reply({embeds: [reply], ephemeral: true});
    await logCommand(interaction);
  }
};