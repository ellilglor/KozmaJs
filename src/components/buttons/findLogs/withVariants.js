const { searchLogs } = require('@functions/commands/findlogs');
const { getLanguage } = require('@functions/general');

module.exports = {
  data: {
    name: 'research-var'
  },
  async execute (interaction) {
    if (!interaction) return;

    const lan = getLanguage('temp').findLogs;
    const title = interaction.message.embeds[0].data.title;
    const item = title.startsWith("I") ? title.slice(35, -3) : title.slice(33, -24);
    const months = 24, checkVariants = true;

    console.log(`${interaction.user.tag} searched for more logs of ${item}`);

    await interaction.user.createDM();
    await interaction.message.edit({ components: [] });
    await searchLogs(interaction, [item], months, checkVariants, lan);
  }
};