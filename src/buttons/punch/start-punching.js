const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: {
    name: 'start-punching'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = new MessageEmbed(interaction.message.embeds[0]);
    const unlockEmoji = '🔓';
    let uvCount = 0;

    embed.title = embed.title.replace('You crafted: ', '');
    embed.fields[embed.fields.length - 1] = { name: 'Crowns Spent', value: '0' };

    for (const field of embed.fields) {
      if (field.name.includes('UV #')) {
        field.name = unlockEmoji.concat(' ', field.name);
        uvCount += 1;
      }
    }
    
    const lockButtons = new MessageActionRow().addComponents(
      new MessageButton()
				.setCustomId('punch-lock').setEmoji('🔒').setStyle('PRIMARY')
        .setDisabled(true),
      new MessageButton()
				.setCustomId('punch-lock1').setEmoji('1️⃣').setStyle('SECONDARY')
        .setDisabled(uvCount < 1),
      new MessageButton()
				.setCustomId('punch-lock2').setEmoji('2️⃣').setStyle('SECONDARY')
        .setDisabled(uvCount < 2),
      new MessageButton()
        .setCustomId('punch-lock3').setEmoji('3️⃣').setStyle('SECONDARY')
        .setDisabled(uvCount < 3)
		);

    const gambleButtons = new MessageActionRow().addComponents(
      new MessageButton()
				.setCustomId('punch-gamble').setEmoji('🎲').setStyle('PRIMARY')
        .setDisabled(true),
      new MessageButton()
				.setCustomId('punch-gamble1').setEmoji('1️⃣').setStyle('SECONDARY'),
      new MessageButton()
				.setCustomId('punch-gamble2').setEmoji('2️⃣').setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('punch-gamble3').setEmoji('3️⃣').setStyle('SECONDARY')
		);
    
    await interaction.update({ embeds: [embed], components: [lockButtons, gambleButtons] });
  }
};