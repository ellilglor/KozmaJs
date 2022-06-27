const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbed } = require('../../functions/general');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription(`Kozma's Backpack staff only.`)
    .setDefaultPermission(false),
	async execute(interaction) {
	  //if (interaction.channel.id === '879297439054581770') { return }
    const reply = buildEmbed().setTitle('Currently not in use.');
    await interaction.deferReply({ephemeral: true});

    const guild = await interaction.client.guilds.fetch('760222722919497820');
    await guild.members.fetch();
    const logChannel = interaction.client.channels.cache.get('879297439054581770');
    const logMessages = await logChannel.messages.fetch({ limit: 3 });
    logMessages.every(msg => {
      const member = guild.members.cache.get(msg.author.id);
      if (member) console.log(member.user.username)
      return true;
    })

	  await interaction.editReply({embeds: [reply]});
  }  
};