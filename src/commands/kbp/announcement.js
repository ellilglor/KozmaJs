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
		.setName('game-announcement')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultMemberPermissions(perms.KickMembers | perms.BanMembers)
    .addSubcommand(subcommand =>
		  subcommand.setName('post')
			.setDescription('Create a game announcement.'))
	  .addSubcommand(subcommand =>
		  subcommand.setName('edit')
			.setDescription('Edit the last posted game announcement.')
      .addStringOption(option =>
		    option.setName('title')
			    .setDescription('Change the embed title.')
          .addChoices({ name: 'yes', value: 'yes' }))
      .addStringOption(option =>
		    option.setName('description')
			  .setDescription('Change the embed description.')
        .addChoices({ name: 'yes', value: 'yes' }))
      .addStringOption(option =>
		    option.setName('date')
			  .setDescription('Change the date the event ends.')
        .addChoices({ name: 'yes', value: 'yes' }))
      .addStringOption(option =>
		    option.setName('url')
			  .setDescription('Change the embed info url.')
        .addChoices({ name: 'yes', value: 'yes' }))
      .addStringOption(option =>
		    option.setName('image')
			  .setDescription('Change the embed image.')
        .addChoices({ name: 'yes', value: 'yes' }))),
	async execute(interaction) {
      const modal = new ModalBuilder();
    
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
    
    if (interaction.options?.getSubcommand() === 'edit') {
      modal.setCustomId('edit-announcement').setTitle('fixing the last announcement');

      if (interaction.options.getString('title')) modal.addComponents(title);
      if (interaction.options.getString('description')) modal.addComponents(description);
      if (interaction.options.getString('date')) modal.addComponents(date);
      if (interaction.options.getString('url')) modal.addComponents(info);
      if (interaction.options.getString('image')) modal.addComponents(image);
    } else {
      modal
        .setCustomId('create-announcement')
        .setTitle('Creating an announcement')
        .addComponents(title, description, date, info, image);
    }

    if (modal.components.length === 0) {
      await interaction.reply({ content: 'You need to select at least 1 option!', ephemeral: true });
    } else {
      await interaction.showModal(modal);
    }
  }  
};