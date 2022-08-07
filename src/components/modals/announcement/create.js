const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'create-announcement'
  },
  async execute (interaction) {
    if (!interaction) return;

    const title = interaction.fields.getTextInputValue('titleInput');
    const desc = interaction.fields.getTextInputValue('descInput');
    const date = new Date(interaction.fields.getTextInputValue('dateInput'));
    const info = interaction.fields.getTextInputValue('infoInput');
    let image = interaction.fields.getTextInputValue('imageInput');
    const timestamp = Math.round(date.getTime()/1000);
    
    try {
      image = new URL(image);
    } catch (_) {
      image = null;  
    }

    const embed = new EmbedBuilder()
      .setColor('#29D0FF')
	    .setTitle(title)
	    .setDescription(desc)
	    .addFields(
		    { name: 'End date:', value: `<t:${timestamp}:F>`, inline: true },
		    { name: 'Finished:', value: `<t:${timestamp}:R>`, inline: true },
		    { name: 'More information can be found here:', value: `[**Link**](${info})` }
	    )
	    .setImage(image)
	    .setTimestamp()
	    .setFooter({ 
        text: 'Game Announcement', 
        iconURL: interaction.client.user.displayAvatarURL()
      });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
				.setCustomId('announce-post').setEmoji('✔️').setStyle('Success'),
      new ButtonBuilder()
        .setCustomId('announce-remake').setEmoji('✖️').setStyle('Danger')
		);

    const msg = { embeds: [embed], components: [buttons], ephemeral: true };
    interaction.message ? await interaction.update(msg) : await interaction.reply(msg);
  }
};