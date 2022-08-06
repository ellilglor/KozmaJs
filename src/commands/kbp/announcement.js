const { 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  PermissionFlagsBits: perms 
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-announcement')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers),
	async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('create-announcement').setTitle('Creating an announcement');

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

    const first = new ActionRowBuilder().addComponents(titleInput);
		const second = new ActionRowBuilder().addComponents(descInput);
    const third = new ActionRowBuilder().addComponents(dateInput);
		const fourth = new ActionRowBuilder().addComponents(infoInput);
    const fifth = new ActionRowBuilder().addComponents(imageInput);
    modal.addComponents(first, second, third, fourth, fifth);

    await interaction.showModal(modal);
  }  
};