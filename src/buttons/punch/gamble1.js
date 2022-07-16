const { MessageEmbed } = require('discord.js');
const { rollUv } = require('../../functions/commands/punch');

module.exports = {
  data: {
    name: 'punch-gamble1'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = new MessageEmbed(interaction.message.embeds[0]).setDescription('').setImage('');
    const buttons = interaction.message.components;
    const crafting = false;
    let index = 0, singleRolls = false;

    if (!embed.fields[0].name.includes('UV')) embed.fields.unshift({ name: '🔓 UV #1', value: '', inline: true });
    embed.fields[0].value = rollUv(embed.title, crafting, []);
    embed.fields = embed.fields.filter(f => { return (!f.name.includes('UV #2') && !f.name.includes('UV #3')) });

    for (const f in embed.fields) {
      switch(embed.fields[f].name) {
        case 'Crowns Spent':
          embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 20000).toLocaleString('en');
          index = parseInt(f) + 1;
          break;
        case 'Single Rolls':
          embed.fields[f].value = (parseInt(embed.fields[f].value.replace(/,/g, '')) + 1).toLocaleString('en');
          singleRolls = true;
      } 
    }

    if (!singleRolls) embed.fields.splice(index, 0, { name: 'Single Rolls', value: '1', inline: true });

    buttons[0].components[1].disabled = false;
    buttons[0].components[2].disabled = true;
    buttons[0].components[3].disabled = true;

    await interaction.update({ embeds: [embed], components: buttons });
  }
};