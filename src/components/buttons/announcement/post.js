const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'announce-post'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    const channel = interaction.client.channels.cache.get('879297439054581770');
    const posted = new EmbedBuilder().setColor('#29D0FF').setTitle('I have posted the embed!');

    await interaction.user.send({ content: '<@214787913097936896>', embeds: [embed] });
    //await channel.send({ content: '<@&875755403093344287>', embeds: [embed] });
    await interaction.update({ embeds: [posted], components: [] });
  }
};