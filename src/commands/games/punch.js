const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { setPlayer, updatePlayer, craftItem, checkForGm, logCrafter } = require('@functions/commands/punch');
const { buildEmbed, logCommand } = require('@functions/general');
const { images } = require('@structures/punch');
const wait = require('util').promisify(setTimeout);

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
      { name: 'Blast Bomb', value: 'Blast Bomb'},
      { name: 'Swiftstrike Buckler', value: 'Swiftstrike Buckler' },
      { name: 'Black Kat Cowl', value: 'Black Kat Cowl' }
    )),
	async execute(interaction, option, crafted) {
    const item = option || interaction.options.getString('item');
    const punch = images.get('Punch');
    const reply = buildEmbed(interaction).setAuthor(punch).setImage(images.get('Crafting').gif);
    const craftUvs = craftItem(item);
    
    const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('recraft').setLabel('Recraft').setStyle('Primary'),
      new ButtonBuilder()
				.setCustomId('start-punching').setLabel('Start Rolling Uvs').setStyle('Primary')
		);

    if (!option) {
      await logCommand(interaction, option);
      setPlayer(interaction, item);
    } else {
      logCrafter(interaction, item);
    }
    
    let result = buildEmbed(interaction)
      .setAuthor(punch)
      .setTitle(`You crafted: ${item}`)
      .setThumbnail(images.get(item).image);
    
    craftUvs.forEach((uv, ind) => {
      updatePlayer(interaction, item, uv);
      result.addFields([{ name: `UV #${ind + 1}`, value: uv, inline: true }]);
    });
    result.addFields([{ name: 'Amount crafted', value: crafted || '1' }]);
    result = checkForGm(result, interaction);

    const message = { embeds: [reply], components: [], ephemeral: true };
      
    option ? await interaction.update(message) : await interaction.reply(message);
    await wait(2500); await interaction.editReply({ embeds: [result], components: [buttons] });
	}
};