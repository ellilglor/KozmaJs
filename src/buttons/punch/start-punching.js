const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'start-punching'
  },
  async execute (interaction) {
    if (!interaction) return;

    const embed = EmbedBuilder.from(interaction.message.embeds[0]);
    const unlockEmoji = '🔓';
    let uvCount = 0;

    embed.setTitle(embed.data.title.replace('You crafted: ', ''));
    embed.data.fields[embed.data.fields.length - 1] = { name: 'Crowns Spent', value: '0' };

    for (const field of embed.data.fields) {
      if (field.name.includes('UV #')) {
        field.name = unlockEmoji.concat(' ', field.name);
        uvCount += 1;
      }
    }
    
    const lockButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
				.setCustomId('punch-lock').setEmoji('🔒').setStyle('Primary'),
      new ButtonBuilder()
				.setCustomId('punch-lock1').setEmoji('1️⃣').setStyle('Secondary')
        .setDisabled(uvCount < 1),
      new ButtonBuilder()
				.setCustomId('punch-lock2').setEmoji('2️⃣').setStyle('Secondary')
        .setDisabled(uvCount < 2),
      new ButtonBuilder()
        .setCustomId('punch-lock3').setEmoji('3️⃣').setStyle('Secondary')
        .setDisabled(uvCount < 3)
		);

    const gambleButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
				.setCustomId('punch-gamble').setEmoji('🎲').setStyle('Primary'),
      new ButtonBuilder()
				.setCustomId('punch-gamble1').setEmoji('1️⃣').setStyle('Secondary'),
      new ButtonBuilder()
				.setCustomId('punch-gamble2').setEmoji('2️⃣').setStyle('Secondary'),
      new ButtonBuilder()
        .setCustomId('punch-gamble3').setEmoji('3️⃣').setStyle('Secondary')
		);
    
    await interaction.update({ embeds: [embed], components: [lockButtons, gambleButtons] });
  }
};