const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'announce-edit'
  },
  async execute (interaction) {
    if (!interaction) return;
    
    const titleInput = new TextInputBuilder()
			.setCustomId('titleInput').setLabel('What should I put as the title?')
			.setStyle(TextInputStyle.Short);

    const descInput = new TextInputBuilder()
			.setCustomId('descInput').setLabel('What should the description be?')
			.setStyle(TextInputStyle.Paragraph);

    const dateInput = new TextInputBuilder()
			.setCustomId('dateInput').setLabel('When does it end? format:YYYY-MM-DDTHH:MM:SSZ')
			.setStyle(TextInputStyle.Short);

    const infoInput = new TextInputBuilder()
			.setCustomId('infoInput').setLabel('Is there a link you want to mention?')
			.setStyle(TextInputStyle.Short);

    const imageInput = new TextInputBuilder()
			.setCustomId('imageInput').setLabel('Do you have an image for me?')
			.setStyle(TextInputStyle.Short);

    const title = new ActionRowBuilder().addComponents(titleInput);
		const description = new ActionRowBuilder().addComponents(descInput);
    const date = new ActionRowBuilder().addComponents(dateInput);
		const info = new ActionRowBuilder().addComponents(infoInput);
    const image = new ActionRowBuilder().addComponents(imageInput);
    const modal = new ModalBuilder().setCustomId('edit-announcement').setTitle('editing the announcement');
    const content = interaction.message.content;

    if (content.includes('title ✅')) modal.addComponents(title);
    if (content.includes('description ✅')) modal.addComponents(description);
    if (content.includes('date ✅')) modal.addComponents(date);
    if (content.includes('link ✅')) modal.addComponents(info);
    if (content.includes('image ✅')) modal.addComponents(image);

    if (modal.components.length === 0) {
      await interaction.reply({ content: 'You need to select at least 1 field to change!', ephemeral: true });
    } else {
      await interaction.showModal(modal);
    }
  }
};