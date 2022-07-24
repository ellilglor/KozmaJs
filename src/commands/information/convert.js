const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('../../functions/general');
const { getRate } = require('../../functions/database/rate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('Convert crowns or energy.')
    .addStringOption(option =>
		  option.setName('currency')
			.setDescription('Currency you want to convert.')
      .setRequired(true)
      .addChoices(
      { name: 'Crowns', value: 'crowns' },
      { name: 'Energy', value: 'energy' }
    ))
    .addIntegerOption(option =>
		  option.setName('amount')
			.setDescription('Amount you want to convert.')
      .setMinValue(1000)
			.setRequired(true))
    .addIntegerOption(option =>
		  option.setName('rate')
			.setDescription('Optional custom conversion rate.')
      .setMinValue(1)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const currency = interaction.options.getString('currency');
    const rate = interaction.options.getInteger('rate') || await getRate();
    const reply = buildEmbed().setDescription(`Used conversion rate: **${rate}** crowns per energy.`);

    if (currency === 'crowns') {
      const converted = Math.round(amount/rate).toLocaleString('en');
      reply.setTitle(`${amount.toLocaleString('en')} Crowns is equal to roughly ${converted} Energy.`).setColor('#f9d49c');
    } else {
      const converted = Math.round(amount*rate).toLocaleString('en');
      reply.setTitle(`${amount.toLocaleString('en')} Energy is equal to roughly ${converted} Crowns.`);
    }
    
    await interaction.reply({ embeds: [reply], ephemeral: true });
    await logCommand(interaction);
  }
};