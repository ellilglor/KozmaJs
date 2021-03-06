const spreadsheet = ["brand","glacius","combuster","voltedge","flourish","snarble barb","thorn blade","sealed sword","avenger","faust","autogun","needle","chaingun", "alchemer","driver","magnus","tundrus","winter grave","blaster","antigua","raptor", "silversix","blackhawk","pulsar","wildfire","riftlocker","phantamos","permafroster", "grim reapater","gilded griffin","arcana","obsidian carbine","supernova","polaris", "valiance","sentenza","iron slug","callahan","argent peacemaker","blast bomb", "electron","graviton","spine cone","vaporizer","haze","capacitor","smogger","spike shower","atomizer","slumber squall","stagger storm","voltaic tempest","dark briar barrage","venom veiler","torpor tantrum","shivermist buster","nitronome","ash of agni","black kat"];

const equipmentFamilies = {
"brandishes": ['brandish', 'shockburst brandish', 'iceburst brandish', 'fireburst brandish', 'nightblade', 'cautery sword', 'boltbrand', 'silent nightblade', 'blizzbrand', 'blazebrand', 'advanced cautery sword', 'obsidian edge', 'voltedge', 'glacius', 'combuster', 'amputator', 'acheron'],

"flourishes": ['flourish', 'snarble barb', 'twisted snarble barb', 'swift flourish', 'rigadoon', 'flamberge', 'dark thorn blade', 'grand flourish', 'fierce flamberge', 'daring rigadoon', 'barbarous thorn blade', 'furious flamberge', 'final flourish', 'fearless rigadoon'],

"troikas": ['troika', 'grintovec', 'kamarin', 'jalovec', 'khorovod', 'triglav', 'sudaruska'],

"spurs": ['spur', 'arc razor', 'winmillion', 'turbillion'],

"cutters": ['cutter', 'striker', 'vile striker', 'hunting blade', 'dread venom striker', 'wild hunting blade'],

"caliburs": ['calibur', 'tempered calibur', 'cold iron carver', 'ascended calibur', 'leviathan blade', 'cold iron vanquisher'],

"sealed swords": ['sealed sword', 'faust', 'avenger', 'gran faust', 'divine avenger'],

"pulars": ['pulsar', 'freezing pulsar', 'flaming pulsar', 'kilowatt pulsar', 'heavy pulsar', 'frozen pulsar', 'blazing pulsar', 'radiant pulsar', 'gigawatt pulsar', 'wildfire', 'permafroster', 'supernova', 'polaris'],

"catalyzers": ['catalyzer', 'toxic catalyzer', 'industrial catalyzer', 'volatile catalyzer', 'virulent catalyzer', 'neutralizer', 'biohazard'],

"alchemers": ['voltech alchemer', 'shadowtech alchemer', 'prismatech alchemer', 'firotech alchemer', 'cryotech alchemer', 'shadowtech alchemer mk ii', 'prismatech alchemer mk ii', 'firotech alchemer mk ii', 'cryotech alchemer mk ii', 'volt driver', 'shadow driver', 'prisma driver', 'firo driver', 'cryo driver', 'umbra driver', 'storm driver', 'nova driver', 'magma driver', 'hail driver'],

"autoguns": ['autogun', 'dark chaingun', 'toxic needle', 'pepperbox', 'needle shot', 'black chaingun', 'blight needle', 'strike needle', 'fiery pepperbox', 'grim repeater', 'plague needle', 'volcanic pepperbox', 'blitz needle'],

"blasters": ['blaster', 'shadow blaster', 'pierce blaster', 'elemental blaster', 'super blaster', 'umbral blaster', 'fusion blaster', 'breach blaster', 'master blaster', 'riftlocker', 'phantamos', 'arcana', 'valiance'],

"magnuses": ['tundrus', 'magnus', 'mega tundrus', 'mega magnus', 'iron slug', 'winter grave', 'callahan'],

"torto guns": ['wild buster', 'stoic buster', 'primal buster', 'grim buster', 'nether cannon', 'mighty cannon', 'feral cannon', 'barrier cannon', 'savage tortofist', 'omega tortofist', 'grand tortofist', 'gorgofist'],

"antiguas": ['antigua', 'raptor', 'silversix', 'blackhawk', 'gilded griffin', 'obsidian carbine', 'sentenza', 'argent peacemaker'],

"shard bombs": ['splinter bomb', 'shard bomb', 'dark matter bomb', 'crystal bomb', 'super splinter bomb', 'super shard bomb', 'super dark matter bomb', 'super crystal bomb', 'sun shards', 'rock salt bomb', 'radiant sun shards', 'ionized salt bomb', 'heavy splinter bomb', 'heavy shard bomb', 'heavy dark matter bomb', 'heavy crystal bomb', 'shocking salt bomb', 'scintillating sun shards', 'deadly splinter bomb', 'deadly shard bomb', 'deadly dark matter bomb', 'deadly crystal bomb'],

"mist bombs": ['haze bomb', 'static capacitor', 'toxic vaporizer', 'slumber smogger', 'freezing vaporizer', 'fiery vaporizer', 'haze bomb mk ii', 'lightning capacitor', 'toxic vaporizer mk ii', 'slumber smogger mk ii', ' freezing vaporizer mk ii', 'fiery vaporizer mk ii', 'haze burst', 'plasma capacitor', 'toxic atomizer', 'slumber squall', 'freezing atomizer', 'fiery atomizer', 'stagger storm', 'voltaic tempest', 'venom veiler', 'torpor tantrum', 'shivermist buster', 'ash of agni'],

"snarb bombs": ['spine cone', 'twisted spine cone', 'spike shower', 'dark briar barrage'],

"blast bombs": ['blast bomb', 'super blast bomb', 'deconstructor', 'master blast bomb', 'irontech bomb', 'heavy deconstructor', 'nitronome', 'irontech destroyer', 'big angry bomb'],

"vortexes": ['electron charge', 'graviton charge', 'electron bomb', 'graviton bomb', 'obsidian crusher', 'electron vortex', 'graviton vortex'],

"wolver set": ['wolver coat', 'padded hunting coat', 'dusker coat', 'quilted hunting coat', 'ash tail coat', 'vog cub coat', 'starlit hunting coat', 'snarbolax coat', 'skolver coat', 'wolver cap', 'padded hunting cap', 'dusker cap', 'quilted hunting cap', 'ash tail cap', 'vog cub capt', 'starlit hunting cap', 'snarbolax cap', 'skolver cap'],

"cloak sets": ['magic cloak', 'elemental cloak', 'miracle cloak', 'chaos cloak', 'divine mantle', 'grey feather mantle', 'magic hood', 'elemental hood', 'miracle hood', 'chaos cowl', 'divine veil', 'grey feather cowl'],

"kat sets": ['kat hiss cloak', 'kat hiss mail', 'kat hiss raiment', 'kat hiss hood', 'kat hiss mask', 'kat hiss cowl', 'kat eye cloak', 'kat eye mail', 'kat eye raiment', 'kat eye hood', 'kat eye mask', 'kat eye cowl', 'kat claw cloak', 'kat claw mail', 'kat claw raiment', 'kat claw hood', 'kat claw mask', 'kat claw cowl'],

"bkat cloaks": ['black kat cloak', 'black kat mail', 'black kat raiment'],

"gunslinger sets": ['gunslinger sash', 'sunset duster', 'deadshot mantle', 'justifier jacket', 'nameless poncho', 'shadowsun slicker', 'gunslinger hat', 'sunset stetson', 'deadshot chapeau', 'justifier hat', 'nameless hat', 'shadowsun stetson'],

"demo sets": ['spiral demo suit', 'fused demo suit', 'padded demo suit', 'heavy demo suit', 'quilted demo suit', 'bombastic demo suit', 'mad bomber suit', 'mercurial demo suit', 'volcanic demo suit', 'starlit demo suit', 'spiral demo helm', 'fused demo helm', 'padded demo helm', 'heavy demo helm', 'quilted demo helm', 'bombastic demo helm', 'mad bomber mask', 'mercurial demo helm', 'volcanic demo helm', 'starlit demo helm'],

"skelly sets": ['skelly suit', 'scary skelly suit', 'sinister skelly suit', 'dread skelly suit', 'skelly mask', 'scary skelly mask', 'sinister skelly mask', 'dread skelly mask'],

"cobalt sets": ['cobalt armor, solid cobalt armor', 'mighty cobalt armor', 'azure guardian armor', 'almirian crusador armor', 'cobalt helm', 'solid cobalt helm', 'mighty cobalt helm', 'azure guardian helm', 'almirian crusader helm'],

"jelly sets": ['jelly mail', 'brute jelly mail', 'rock jelly mail', 'ice queen mail', 'royal jelly mail', 'jelly helm', 'brute jelly helm', 'rock jelly helm', 'ice queen crown', 'royal jelly crown', 'quicksilver mail', 'charged quicksilver mail', 'mercurial mail', 'quicksilver helm', 'charged quicksilver helm', 'mercurial helm'],

"plate sets": ['spiral plate mail', 'boosted plate mail', 'heavy plate mail', 'ironmight plate mail', 'volcanic plate mail', 'spiral plate helm', 'boosted plate helm', 'heavy plate helm', 'ironmight plate helm', 'volcanic plate helm'],

"chroma sets": ['chroma suit', 'salamander suit', 'virulisk suit', 'arcane salamander suit', 'volcanic salamander suit', 'deadly virulisk suit', 'chroma mask', 'salamander mask', 'virulisk mask', 'arcane salamander mask', 'volcanic salamander mask', 'deadly virulisk mask'],

"angelic sets": ['angelic raiment', 'seraphic mail', 'armor of the fallen', 'heavenly iron armor', 'valkyrie mail', 'angelic helm', 'seraphic helm', 'crown of the fallen', 'heavenly iron helm', 'valkyrie helm'],

"scale sets": ['drake scale mail', 'wyvern scale mail', 'silvermail', 'dragon scale mail', 'radiant silvermail', 'drake scale helm', 'wyvern scale helm', 'dragon scale helm'],

"pathfinder sets": ['pathfinder armor', 'woven falcon pathfinder armor', 'woven firefly pathfinder armor', 'woven grizzle pathfinder armor', 'woven snakebite pathfinder armor', 'plated falcon pathfinder armor', 'plated firefly pathfinder armor', 'plated grizzly pathfinder armor', 'plated snakebite pathfinder armor', 'sacred falcon pathfinder armor', 'sacred falcon guerrila armor', 'sacred falcon hazard armor', 'sacred firefly pathfinder armor', 'sacred firefly guerilla armor', 'sacred firefly hazard armor', 'sacred grizzly pathfinder armor', 'sacred grizlly guerilla armor', 'sacred grizzly hazard armor', 'sacred snakebite pathfinder armor', 'sacred snakebite guerilla armor', 'sacred snakebite hazard armor', 'pathfinder helm', 'woven falcon pathfinder helm', 'woven firefly pathfinder helm', 'woven grizzly pathfinder helm', 'woven snakebite pathfinder helm', 'plated falcon pathfinder helm', 'plated firefly pathfinder helm', 'plated grizzly pathfinder helm', 'plated snakebite pathfinder helm', 'sacred falcon pathfinder helm', 'sacred falcon guerilla helm', 'sacred falcon hazard helm', 'sacred firefly pathfinder helm', 'sacred firefly guerilla helm', 'sacred firefly hazard helm', 'sacred grizzly pathfinder helm', 'sacred grizzly guerilla helm', 'sacred grizzly hazard helm', 'sacred snakebite pathfinder helm', 'sacred snakebite guerilla helm', 'sacred snakebite hazard helm'],

"sentinel sets": ['sentinel armor', 'woven falcon sentinel armor', 'woven firefly sentinel armor', 'woven grizzly sentinel armor', 'woven snakebite sentinel armor', 'plated falcon sentinel armor', 'plated firefly sentinel armor', 'plated grizzly sentinel armor', 'plated snakebite sentinel armor', 'sacred falcon sentinel armor', 'sacred falcon keeper armor', 'sacred falcon wraith armor', 'sacred firefly sentinel armor', 'sacred firefly keeper armor', ' sacred firefly wraith armor', 'sacred grizzly sentinel armor', 'sacred grizzly keeper armor', 'sacred grizzly wraith armor', 'sacred snakebite sentinel armor', 'sacred snakebite keeper armor', 'sacred snakebite wraith armor', 'sentinel helm', 'woven falcon sentinel helm', 'woven firefly sentinel helm', 'woven grizzly sentinel helm', 'woven snakebite sentinel helm', 'plated falcon sentinel helm', 'plated firefly sentinel helm', 'plated grizzly sentinel helm', 'plated snakebite sentinel helm', 'sacred falcon sentinel helm', 'sacred falcon keeper helm', 'sacred falcon wraith helm', 'sacred firefly sentinel helm', 'sacred firefly keeper helm', 'sacred firefly wraith helm', 'sacred grizzly sentinel helm', 'sacred grizzly keeper helm', 'sacred grizzly wraith helm', 'sacred snakebite sentinel helm', 'sacred snakebite keeper helm', 'sacred snakebite wraith helm'],

"shade sets": [' shade armor', 'woven falcon shade armor', 'woven firefly shade armor', 'woven grizzly shade armor', 'woven snakebite shade armor', 'plated falcon shade armor', 'plated firefly shade armor', 'plated grizzly shade armor', 'plated snakebite shade armor', 'sacred falcon shade armor', 'sacred falcon ghost armor', 'sacred falcon hex armor', 'sacred firefly shade armor', 'sacred firefly ghost armor', 'sacred firefly hex armor', 'sacred grizzly shade armor', 'sacred grizzly ghost armor', 'saccred grizzly hex armor', 'sacred snakebite shade armor', 'sacred snakebite gohst armor', 'sacred snakebite hex armor', 'shade helm', 'woven falcon shade helm', 'woven firefly shade helm', 'woven grizzly shade helm', 'woven snakebite shade helm', 'plated falcon shade helm', 'plated firefly shade helm', 'plated grizzly shade helm', 'plated snakebite shade helm', 'sacred falcon shade helm', 'sacred falcon ghost helm', 'sacred falcon hex helm', 'sacred firefly shade helm', 'sacred firefly ghost helm', 'sacred firefly hex helm', 'sacred grizzly shade helm', 'sacred grizzly ghost helm', 'sacred grizzly hex helm', 'sacred snakebite shade helm', 'sacred snakebite ghost helm', 'sacred snakebite hex helm'],

"snarb shields": ['bristling buckler', 'twisted targe', 'dark thorn shield', 'barbarous thorn shield'],

"skelly shields": ['skelly shield', 'scary skelly shield', 'sinister skelly shield', 'dread skelly shield'],

"plate shields": ['plate shield', 'boosted plate shield', 'heavy plate shield', 'ironmight plate shield', 'volcanic plate shield'],

"owlite shields": ['owlite shield', 'horned owlite shield', 'wise owlite shield', 'grey owlite shield'],

"jelly shields": ['jelly shield', 'brute jelly shield', 'rock jelly shield', 'royal jelly shield'],

"defenders": ['defender', 'great defender', 'mighty defender', 'aegis', 'heater shield'],

"scale shields": ['drake scale shield', 'wyvern scale shield', 'stone tortoise', 'dragon scale shield', 'omega shell'],

"torto shields": ['wild shell', 'feral shell', 'savage tortoise', 'grim shell', 'nether shell', 'gorgomega', 'stoic shell', 'mighty shell', 'grand tortoise', 'primal shell', 'barrier shell', 'omegaward']
};

const colorSets = {
"standard": ['cool', 'dusky', 'fancy', 'heavy', 'military', 'regal', 'toasty'],

"div volc": ['divine', 'volcanic'],

"gems": ['ruby', 'peridot', 'sapphire', 'opal', 'citrine' ,'turquoise' , 'garnet', 'amethyst', 'aquamarine', 'diamond', 'emerald', 'pearl'],

"shadowtech": ['shadowtech blue', 'shadowtech green', 'shadowtech orange', 'shadowtech pink'],

"tech": ['tech blue', 'tech green', 'tech orange', 'tech pink'],

"snipes": ['fern', 'lavender', 'lemon', 'peach', 'rose', 'sky', 'vanilla', 'cocoa', 'cherry', 'lime', 'mint', 'plum', 'sage', 'wheat'],

"winterfest onesies": ['candy striped', 'festively striped', 'holly striped', 'joyous striped'],

"winterfest pullovers": ['flashy winter', 'garish winter', 'gaudy winter', 'tacky winter'],

"kat suits": ['feral kat', 'primal kat', 'savage kat', 'wild kat'],

"polar colors": ['polar day', 'polar night', 'polar twilight'],

"buhgok tails": ['black buhgok', 'brown buhgok', 'gold buhgok'],

"fowls": ['black fowl', 'brown fowl', 'gold fowl'],

"buckled coats": ['ancient gold', 'hunter gold', 'peridot gold'],

"clovers": ['ancient clover', 'hunter clover', 'peridot clover'],

"lapel clover": ['ancient lapel', 'hunter lapel', 'peridot lapel'],

"lucky toppers": ['ancient lucky', 'hunter lucky', 'peridot lucky'],

"lucky pipes": ['ancient pipe', 'hunter pipe', 'peridot pipe'],

"lucky beards": ['autumn lumberfell', 'citrine lumberfell', 'dazed lumberfell'],

"obsidian": ['influence', 'devotion', 'rituals', 'sight'],

"raider": ['winter raider', 'squall raider', 'firestorm raider'],

"battle chef 1": ['black battle', 'white battle'],

"battle chef 2": ['blue battle', 'red battle'],

"battle chef 3": ['pink battle', 'purple battle', 'yellow battle'],

"rose 1": ['the black rose', 'the white rose'],

"rose 2": ['the gold rose', 'the green rose', 'the blue rose', 'the red rose'],

"rose 3": ['the amethyst rose', 'the aquamarine rose', 'the citrine rose', 'the garnet rose', 'the malachite rose', 'the moonstone rose', 'the turquoise rose'],

"rose 4": ['the coral rose', 'the violet rose']
}

const channels = new Map([
  ['special-listings', '807369188133306408'],
  ['mixed-trades','806452637423370250'],
  ['equipment','806450782542102529'],
  ['costumes','806452033291812865'],
  ['helm-back','806450894693728278'],
  ['helm-front','806450937380077568'],
  ['helm-side','806450974029381662'],
  ['helm-top','806451298434154546'],
  ['armor-aura','806451662716665878'],
  ['armor-ankle','806451696322084877'],
  ['armor-back','806451731826212884'],
  ['armor-front','806451783383121950'],
  ['armor-rear','806451814882082819'],
  ['miscellaneous','806452205146079252'],
  ['Sprite Food', '878045932300677151'],
  ['Materials', '880908641304182785']
]);

const roses = ['black', 'red', 'white', 'blue', 'gold', 'green', 'coral', 'violet', 'moonstone', 'malachite', 'garnet', 'amethyst', 'citrine', 'prismatic', 'aquamarine', 'turquoise'];

const commonFeatured = ['gloweyes', 'divine valkyrie', 'volcanic valkyrie', 'shadow valkyrie', 'scissor', 'prismatic wings', 'tabard of the coral', 'chapeau of the coral', 'prime bombhead', 'tabard of the violet', 'chapeau of the violet', 'volcanic wings', 'divine wings', 'shadow wings', 'medieval war', 'mixmaster', 'tricorne', 'shadow dragon wing'];

const gemExceptions = ['bout', 'rose', 'tabard', 'chaeau', 'buckled', 'clover', 'pipe', 'lumberfell'];

module.exports = {
  spreadsheet,
  equipmentFamilies,
  colorSets,
  channels,
  roses,
  commonFeatured,
  gemExceptions
}