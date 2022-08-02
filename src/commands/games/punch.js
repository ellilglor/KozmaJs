const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { craftItem, getPunchImage, checkForGm } = require('@functions/commands/punch');
const { buildEmbed, logCommand, getLanguage } = require('@functions/general');
const wait = require('util').promisify(setTimeout);

const punch = {
  name: 'Punch:',
  iconURL: 'https://media3.spiralknights.com/wiki-images/archive/1/1b/20200502113903!Punch-Mugshot.png'
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('punch')
		.setDescription(`Create your own GM item!`)
    .addStringOption(option =>
		  option.setName('item')
			.setDescription('Select the item you want to craft.')
      .setRequired(true)
      .addChoices(
      { name: 'Brandish', value: 'Brandish' },
      { name: 'Overcharged Mixmaster', value: 'Overcharged Mixmaster' },
      { name: 'Swiftstrike Buckler', value: 'Swiftstrike Buckler' },
      { name: 'Black Kat Cowl', value: 'Black Kat Cowl' }
    )),
	async execute(interaction, option, crafted) {
    const lan = getLanguage(interaction.locale).punch;
    const item = option || interaction.options.getString('item');
    const reply = buildEmbed(interaction).setAuthor(punch).setTitle(`${lan.title1} ${item}`).setDescription('3...');
    const amount = crafted || '1';
    //await logCommand(interaction, option);

    if (interaction.channel?.id === '879297439054581770') {
      const craftUvs = craftItem(item);
      const buttons = new ActionRowBuilder().addComponents(
			  new ButtonBuilder()
				  .setCustomId('recraft').setLabel(lan.recraftBtn).setStyle('Primary'),
        new ButtonBuilder()
				  .setCustomId('start-punching').setLabel(lan.startBtn).setStyle('Primary')
		  );

      let result = buildEmbed(interaction).setAuthor(punch).setTitle(`${lan.title2}: ${item}`).setThumbnail(getPunchImage(item));
      craftUvs.forEach((uv, ind) => { result.addFields([{ name: `UV #${ind + 1}`, value: uv, inline: true }]) });
      result.addFields([{ name: lan.crafted, value: amount }]);
      result = checkForGm(result, interaction);

      const message = { embeds: [reply], components: [], ephemeral: true };
      
      option ? await interaction.update(message) : await interaction.reply(message);
      await wait(1000); await interaction.editReply({ embeds: [reply.setDescription('2...')] });;
      await wait(1000); await interaction.editReply({ embeds: [reply.setDescription('1...')] });
      await wait(1000); await interaction.editReply({ embeds: [result], components: [buttons] });
    } else { 
      reply.setTitle('This Command is not implemented yet.')
        .setDescription('An announcement will be made once its ready.'); 

      console.log(interaction.user.tag)

      await interaction.reply({ embeds: [reply], ephemeral: true });
    }
	}
};