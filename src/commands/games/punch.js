const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { buildEmbed, logCommand } = require('../../functions/general');
const { craftItem, rollUv, getPunchImage } = require('../../functions/commands/punch');
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
			.addChoice('Brandish', 'Brandish')
      .addChoice('Overcharged Mixmaster', 'Overcharged Mixmaster')
      .addChoice('Swiftstrike Buckler', 'Swiftstrike Buckler')
      .addChoice('Black Kat Cowl', 'Black Kat Cowl')),
	async execute(interaction, option, crafted) {
    const reply = buildEmbed().setAuthor(punch);
    const item = option || interaction.options.getString('item');
    const amount = crafted || '1';
    //await logCommand(interaction, option);

    if (interaction.channel?.id === '879297439054581770') {
      const craftUvs = craftItem(item);
      const buttons = new MessageActionRow().addComponents(
			  new MessageButton()
				  .setCustomId('recraft').setLabel('Recraft').setStyle('PRIMARY'),
        new MessageButton()
				  .setCustomId('start-punching').setLabel('Start Rolling Uvs').setStyle('PRIMARY')
		  );

      const result = buildEmbed()
        .setAuthor(punch)
        .setTitle(`You crafted: ${item}`)
        .setThumbnail(getPunchImage(item));

      for (const uv in craftUvs) {
        result.addField(`UV #${parseInt(uv) + 1}`, craftUvs[uv], true);
      }
      result.addField('Amount crafted:', amount);

      reply.setTitle(`Crafting ${item}`).setDescription('3...');
      const message = { embeds: [reply], components: [], ephemeral: true };
      option ? await interaction.update(message) : await interaction.reply(message);
      
      await wait(1000); await interaction.editReply({ embeds: [reply.setDescription('2...')] });;
      await wait(1000); await interaction.editReply({ embeds: [reply.setDescription('1...')] });
      await wait(1000); await interaction.editReply({ embeds: [result], components: [buttons] });
    } else { 
      reply.setTitle('This Command is not implemented yet.')
        .setDescription('An announcement will be made once its ready.'); 

      console.log(interaction.user.tag)

      await interaction.reply({embeds: [reply], ephemeral: true});
    }
	}
};