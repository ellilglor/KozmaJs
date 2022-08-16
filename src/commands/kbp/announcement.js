const { 
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
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
    .addStringOption(option =>
		  option.setName('id')
			.setDescription('The message id')),
	async execute(interaction) {
    const id = interaction.options.getString('id');

    if (id) {
      //const channel = interaction.client.channels.cache.get('879297439054581770');
      await interaction.user.createDM();
      const channel = interaction.user.dmChannel;

      try {
        const message = await channel.messages.fetch(id);
        const embed = EmbedBuilder.from(message.embeds[0]);

        const content = 
          `id: ${id}\nSelect which parts of the message you would like to edit:\n` +
          '🇦 - title ❌\n🇧 - description ❌\n🇨 - date ❌\n🇩 - link ❌\n🇪 - image ❌';

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
				    .setCustomId('announce-title').setEmoji('🇦').setStyle('Secondary'),
          new ButtonBuilder()
				    .setCustomId('announce-desc').setEmoji('🇧').setStyle('Secondary'),
          new ButtonBuilder()
				    .setCustomId('announce-date').setEmoji('🇨').setStyle('Secondary'),
          new ButtonBuilder()
            .setCustomId('announce-link').setEmoji('🇩').setStyle('Secondary'),
          new ButtonBuilder()
            .setCustomId('announce-image').setEmoji('🇪').setStyle('Secondary')
		    );

        const edit = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('announce-edit').setLabel('edit').setStyle('Success')
        );
        
        await interaction.reply({ content: content, embeds: [embed], components: [buttons, edit], ephemeral: true });
      } catch (_) {
        await interaction.reply({ content: 'No message matches that id.', ephemeral: true });
      }
    } else {
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

      const modal = new ModalBuilder()
        .setCustomId('create-announcement')
        .setTitle('Creating an announcement')
        .addComponents(title, description, date, info, image);

      await interaction.showModal(modal);
    }
  }  
};