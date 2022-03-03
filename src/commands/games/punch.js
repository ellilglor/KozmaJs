const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { buildEmbed, logCommand } = require('../../functions/general');
const { craftItem, rollUv, getPunchImage } = require('../../functions/commands/punch');
const wait = require('util').promisify(setTimeout);

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
    const reply = buildEmbed().setAuthor({ name: 'Punch:', iconURL: 'https://media3.spiralknights.com/wiki-images/archive/1/1b/20200502113903!Punch-Mugshot.png'});
    const item = option || interaction.options.getString('item');
    const amount = crafted || '1';
    //await logCommand(interaction, option);

    console.log(interaction.user.tag)

    if (interaction.user.tag === 'ellilglor#6866') {
      const craftUvs = craftItem(item);
      const buttons = new MessageActionRow()
		    .addComponents(
			    new MessageButton()
				  .setCustomId('recraft')
				  .setLabel('Recraft')
				  .setStyle('PRIMARY'),
          new MessageButton()
				  .setCustomId('start-punching')
				  .setLabel('Start Rolling Uvs')
				  .setStyle('PRIMARY'),
		  );

      const result = buildEmbed();
      result.setTitle(`You crafted: ${item}`)
        .setAuthor({ name: 'Punch:', iconURL: 'https://media3.spiralknights.com/wiki-images/archive/1/1b/20200502113903!Punch-Mugshot.png'})
        .setThumbnail(getPunchImage(item))
        .addField('Amount crafted:', amount);

      reply.setTitle(`Crafting ${item}`).setDescription('3...');
      option ? await interaction.update({embeds: [reply], components: []}) : await interaction.reply({embeds: [reply], ephemeral: true});
      await wait(1000);
      reply.setDescription('2...');
      await interaction.editReply({embeds: [reply]});
      await wait(1000);
      reply.setDescription('1...');
      await interaction.editReply({embeds: [reply]});
      await wait(1000);
      if (craftUvs.length > 0) {
        reply.setDescription(craftUvs.toString().replace(/,/g, "\n"));
      } else {
        reply.setDescription('');
      }
      await interaction.editReply({embeds: [result], components: [buttons]});
      







    } else { 
      reply.setTitle('This Command is not implemented yet.')
        .setDescription('An announcement will be made once its ready.'); 

      await interaction.reply({embeds: [reply], ephemeral: true});
    }
	}
};