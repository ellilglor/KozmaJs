const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'edit-announcement'
  },
  async execute (interaction) {
    if (!interaction) return;
    
    const embed = EmbedBuilder.from(interaction.message.embeds[0]);
    const content = interaction.message.content, fields = interaction.fields;
    const id = content.match(/\d+/g)[0];

    if (content.includes('title ✅')) embed.setTitle(fields.getTextInputValue('titleInput'));
    if (content.includes('description ✅')) embed.setDescription(fields.getTextInputValue('descInput'));
    if (content.includes('link ✅')) embed.data.fields[2].value = `[**Link**](${fields.getTextInputValue('infoInput')})`;
    
    if (content.includes('date ✅')) {
      const date = new Date(fields.getTextInputValue('dateInput'));
      const timestamp = Math.round(date.getTime()/1000);
      embed.data.fields[0].value = `<t:${timestamp}:F>`;
      embed.data.fields[1].value = `<t:${timestamp}:R>`;
    }
    
    if (content.includes('image ✅')) {
      try {
        new URL(fields.getTextInputValue('imageInput'));
        embed.setImage(fields.getTextInputValue('imageInput'));
      } catch (_) {
        // provided image is not a valid url
      }
    }

    try {
      await interaction.user.createDM();
      const channel = interaction.user.dmChannel;
      const message = await channel.messages.fetch(id);
      const updated = new EmbedBuilder().setColor('#29D0FF').setTitle('I have updated the announcement!');
      
      await message.edit({ embeds: [embed] });
      await interaction.update({ content: null, embeds: [updated], components: [] });
    } catch (_) {
      await interaction.reply({ content: 'No message matches that id.', ephemeral: true });
    }
  }
};