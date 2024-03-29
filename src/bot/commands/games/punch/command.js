const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { setPlayer, updatePlayer, craftItem, checkForGm, logCrafter } = require('./functions/punch');
const { buildEmbed, logCommand } = require('@utils/functions');
const { data } = require('./data/punch');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('punch')
		.setDescription('Craft and roll on an item for Unique Variants.')
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
	async execute(interaction, defer, option, crafted) {
    const item = data.get(option || interaction.options.getString('item'));
    const punch = data.get('Punch');
    const embed = buildEmbed(interaction).setAuthor(punch).setImage(data.get('Crafting').gif);
    const craftUvs = craftItem(item.type);
    
    const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('recraft').setLabel('Recraft').setStyle('Primary'),
      new ButtonBuilder()
				.setCustomId('start-punching').setLabel('Start Rolling Uvs').setStyle('Primary')
		);

    if (!option) {
      await logCommand(interaction, option);
      setPlayer(interaction, item.name);
    } else {
      logCrafter(interaction, item.name);
    }
    
    let finalEmbed = buildEmbed(interaction)
      .setAuthor(punch)
      .setTitle(`You crafted: ${item.name}`)
      .setThumbnail(item.image);
    
    craftUvs.forEach((uv, ind) => {
      updatePlayer(interaction, item.name, uv);
      finalEmbed.addFields([{ name: `UV #${ind + 1}`, value: uv, inline: true }]);
    });
    finalEmbed.addFields([{ name: 'Amount crafted', value: crafted || '1' }]);
    finalEmbed = checkForGm(finalEmbed, interaction);
      
    await interaction.editReply({ embeds: [embed], components: [] });
    await wait(2500); await interaction.editReply({ embeds: [finalEmbed], components: [buttons] });
	}
};