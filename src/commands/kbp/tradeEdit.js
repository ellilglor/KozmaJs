const { SlashCommandBuilder } = require('discord.js');
const { buildEmbed, logCommand } = require('@functions/general');
const { globals } = require('@data/variables');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tradepostedit')
		.setDescription(`Gives you 2 minutes to edit your tradeposts.`),
	async execute(interaction) {
    const reply = buildEmbed(interaction)
      .setTitle('You have 2 minutes to edit your tradeposts.')
      .setDescription('Using this command to bypass the slowmode will result in a timeout.');
    const role = interaction.guild.roles.cache.get(globals.editRoleId);

    await interaction.reply({ embeds: [reply], ephemeral: true });
    await interaction.member.roles.add(role);
    await logCommand(interaction);
    await wait(120000);
    await interaction.member.roles.remove(role);
	  await interaction.editReply({ embeds: [reply.setTitle('Your time is up!').setDescription(null)] });
  }  
};