const { searchLogs } = require('../../functions/findlogs');

module.exports = {
  data: {
    name: 'research-var'
  },
  async execute (interaction) {
    if (!interaction) return;

    const title = interaction.message.embeds[0].data.title;
    const item = title.split(' ').slice(5).toString().replace(/,/g, ' ').replace(/_/g, '');
    const months = 120, checkVariants = true, checkClean = false, checkMixed = true;

    console.log(`${interaction.user.tag} searched for more logs of ${item}`);

    await interaction.user.createDM();
    await interaction.message.edit({ components: [] });
    await searchLogs(interaction, [item], months, checkVariants, checkClean, checkMixed);
  }
};