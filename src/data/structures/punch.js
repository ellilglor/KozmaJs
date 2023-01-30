const images = new Map([
  ['Punch',{ name: 'Punch:', iconURL: 'https://media3.spiralknights.com/wiki-images/archive/1/1b/20200502113903!Punch-Mugshot.png' }],
  ['Crafting',{ gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069643186978430996/crafting.gif' }],
  ['Brandish',{ image: 'https://media3.spiralknights.com/wiki-images/2/22/Brandish-Equipped.png', gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069643184252133406/sword.gif' }],
  ['Overcharged Mixmaster',{ image: 'https://media3.spiralknights.com/wiki-images/f/fd/Overcharged_Mixmaster-Equipped.png', gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069643185170686064/mixmaster.gif' }],
  ['Swiftstrike Buckler',{ image: 'https://media3.spiralknights.com/wiki-images/5/5b/Swiftstrike_Buckler-Equipped.png', gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069643184688337027/shield.gif' }],
  ['Black Kat Cowl',{ image: 'https://media3.spiralknights.com/wiki-images/2/20/Black_Kat_Cowl-Equipped.png', gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069643185539776532/helm.gif' }],
  ['Blast Bomb',{ image: 'https://media3.spiralknights.com/wiki-images/c/c2/Blast_Bomb-Equipped.png', gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069643183866253392/bomb.gif' }],
]);

const memes = [
{ author: 'Sweet Bebe Habibi#7850', url: 'https://cdn.discordapp.com/attachments/655331114893705236/931645349678960730/Screenshot_20220114-140401_Firefox_Focus.jpg' },
{ author: 'Luqui#0008', url: 'https://cdn.discordapp.com/attachments/655331114893705236/931642693174583376/unknown_11.png' },
{ author: 'Weylin#0398', url: 'https://cdn.discordapp.com/attachments/655331114893705236/931641454932131900/69.PNG' },
{ author: 'o h b o y#2537', url: 'https://cdn.discordapp.com/attachments/655331114893705236/931638943059959809/tera.PNG' },
{ author: 'o h b o y#2537', url: 'https://cdn.discordapp.com/attachments/655331114893705236/931629209971998760/ed.PNG' },
{ author: 'Gome#6180', url: 'https://cdn.discordapp.com/attachments/655331114893705236/931625162036629595/dyk.png' },
{ author: 'Gome#6180', url: 'https://cdn.discordapp.com/attachments/655331114893705236/931614581623775252/unknown_3.png' },
{ author: 'Top-Platinum#6560', url: 'https://cdn.discordapp.com/attachments/655331114893705236/931612795903029268/stfu-1.png' },
{ author: 'ellilglor#6866', url: 'https://cdn.discordapp.com/attachments/655331114893705236/931611729673220106/unknown.png' },
{ author: 'Fangel#6969', url: 'https://cdn.discordapp.com/attachments/655331114893705236/885639281824120902/unknown.png' },
{ author: 'Voxhail#2457', url: 'https://cdn.discordapp.com/attachments/655331114893705236/885622504566181978/OnlyKnights.png' },
{ author: 'Top-Platinum#6560', url: 'https://media.discordapp.net/attachments/655331114893705236/883428315669614672/2021-05-04_18_57_11-Three_Rings_Model_Viewer.png' },
{ author: 'Arstor', url: 'https://cdn.discordapp.com/attachments/655331114893705236/883426946699104286/Trade_Offer.png' },
{ author: 'Arstor', url: 'https://cdn.discordapp.com/attachments/655331114893705236/883425556081823774/Remember_ignore_boxes_on_d24_and_d25.png' },
{ author: 'Ultron#5519', url: 'https://cdn.discordapp.com/attachments/655331114893705236/883425228049494017/Spongebob_Square_out_of_money.png' },
{ author: 'Arstor', url: 'https://cdn.discordapp.com/attachments/655331114893705236/883424341117788190/Spongebob_Square_Haven.png' },
{ author: 'Gome#6180', url: 'https://cdn.discordapp.com/attachments/655331114893705236/883421745514700880/doritos.png' },
{ author: 'BlackMan#0658', url: 'https://cdn.discordapp.com/attachments/655331114893705236/802976822907240508/BlackSperm.PNG' },
{ author: 'fishmclishy#0033', url: 'https://cdn.discordapp.com/attachments/655331114893705236/802975998898733077/Nacho_Cheese.PNG' },
{ author: 'Gome#6180', url: 'https://cdn.discordapp.com/attachments/655331114893705236/802974082194604062/nitronomeflash.png' },
{ author: 'ellilglor#6866', url: 'https://cdn.discordapp.com/attachments/655331114893705236/802972409774604369/sadayathewater.png' },
{ author: 'Yates#4638', url: 'https://media.discordapp.net/attachments/655331114893705236/774441946714210304/7T7crUxyHfkHzxvGu9t6YIsAAAAASUVORK5CYII.png' },
{ author: 'Stret#4644', url: 'https://media.discordapp.net/attachments/655331114893705236/774435959634788352/Donotsmokekatsyall.png' },
{ author: 'Gome#6180', url: 'https://media.discordapp.net/attachments/655331114893705236/774430880310755358/Rakaraka_Stonkz_Gerudum.png?width=720&height=405' },
{ author: '- Ð IΞ ᐻ ł Ĺ -#4809', url: 'https://media.discordapp.net/attachments/655331114893705236/713062050192031754/unknown_5.png' },
{ author: 'Serjinxable#0108', url: 'https://media.discordapp.net/attachments/655331114893705236/713054772436926544/can_relate.png' },
{ author: 'Matejko124', url: 'https://cdn.discordapp.com/attachments/655331114893705236/713049512742092991/saii_2018-07-12_20-35-49.png' },
{ author: 'Pireh#0216', url: 'https://media.discordapp.net/attachments/655331114893705236/713048747424350308/unknown_12.png' },
{ author: 'silverhawke#0241', url: 'https://media.discordapp.net/attachments/655331114893705236/713048430661861426/unknown_10.png' },
{ author: 'Aferron#6120', url: 'https://media.discordapp.net/attachments/655331114893705236/713043221600665600/C0L.png?width=720&height=552' },
{ author: 'Aferron#6120', url: 'https://media.discordapp.net/attachments/655331114893705236/713043082991632424/spiral_rancher.png' },
{ author: 'Amber#7194', url: 'https://media.discordapp.net/attachments/655331114893705236/713040198988201984/unknown_3.png?width=720&height=559' },
{ author: 'Drischa', url: 'https://cdn.discordapp.com/attachments/655331114893705236/713039689786851368/samipls.png' },
{ author: 'Fission Mailed#4370', url: 'https://cdn.discordapp.com/attachments/655331114893705236/713010397309042708/unknown_8.png' },
{ author: 'Blitz342#2629', url: 'https://cdn.discordapp.com/attachments/311195183482142720/988240082483937291/D5AD5876-80E4-471C-A935-509D5B779B87.jpg' },
{ author: '- Ð IΞ ᐻ ł Ĺ -#4809', url: 'https://media.discordapp.net/attachments/647164081572282388/971454053949272094/unknown.png?width=676&height=676' },
{ author: 'sirzlime#7373', url: 'https://cdn.discordapp.com/attachments/647164081572282388/887822773764898816/unknown.png' }
];

module.exports = {
  images,
  memes
}