module.exports = {
  data: {
    name: 'punch-lock2'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = interaction.message.embeds[0];
    const buttons = interaction.message.components;
    let lockCount = 0;

    if (embed.fields[1].name.includes('🔒 UV #2')) {
      embed.fields[1].name = '🔓 UV #2';
    } else {
      embed.fields[1].name = '🔒 UV #2';
    }

    for (const field of embed.fields) {
      if (field.name.includes('🔒')) lockCount += 1;
    }

    switch(lockCount) {
      case 3:
        buttons[1].components[3].disabled = true;
        break;
      case 2:
        buttons[1].components[2].disabled = true;
        buttons[1].components[3].disabled = false;
        break;
      case 1:
        buttons[1].components[1].disabled = true;
        buttons[1].components[2].disabled = false;
        buttons[1].components[3].disabled = false;
        break;
      default:
        buttons[1].components[1].disabled = false;
        buttons[1].components[2].disabled = false;
        buttons[1].components[3].disabled = false;
    } 

    await interaction.update({ embeds: [embed], components: buttons });
  }
};