const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand, getLanguage } = require('@functions/general');
const { getRate } = require('@functions/database/rate');

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
    const lan = getLanguage('temp').convert;
    const amount = interaction.options.getInteger('amount');
    const currency = interaction.options.getString('currency');
    const rate = interaction.options.getInteger('rate') || await getRate();
    const reply = buildEmbed().setDescription(`${lan.desc1} **${rate}** ${lan.desc2}`);

    if (currency === 'crowns') {
      const converted = Math.round(amount/rate).toLocaleString('en');
      reply.setTitle(`${amount.toLocaleString('en')} Crowns ${lan.equal} ${converted} Energy.`).setColor('#f9d49c');
    } else {
      const converted = Math.round(amount*rate).toLocaleString('en');
      reply.setTitle(`${amount.toLocaleString('en')} Energy ${lan.equal} ${converted} Crowns.`);
    }
    
    await interaction.reply({ embeds: [reply], ephemeral: true });
    await logCommand(interaction);
  }
};