const channels = new Map([
  ['special-listings', '807369188133306408'], ['2022-flash-sales', '1029020424929038386'],
  ['2021-flash-sales', '909112948956483625'], ['2020-flash-sales', '782744096167034930'],
  ['mixed-trades','806452637423370250'],
  ['equipment','806450782542102529'], ['costumes','806452033291812865'],
  ['helm-top','806451298434154546'], ['helm-front','806450937380077568'],
  ['helm-back','806450894693728278'], ['helm-side','806450974029381662'],
  ['armor-front','806451783383121950'], ['armor-back','806451731826212884'],
  ['armor-rear','806451814882082819'], ['armor-ankle','806451696322084877'],
  ['armor-aura','806451662716665878'], ['miscellaneous','806452205146079252'],
  ['Sprite Food', '878045932300677151'], ['Materials', '880908641304182785']
]);

const filters = [
  { new: 'overcharged mixmaster', old: 'mixmaster', exclude: 'overcharged' },
  { new: 'somnambulists totem', old: 'totem', exclude: 'somnambulists' },
  { new: 'orbitgun', old: 'orbit gun', exclude: null },
  { new: 'celestial orbitgun', old: 'orbitgun', exclude: 'celestial' },
  { new: 'daybreaker band', old: 'daybreaker', exclude: 'band' },
  { new: 'overcharged mixmaster', old: 'mixer', exclude: null },
  { new: 'spiral soaker', old: 'soaker', exclude: 'spiral' },
  { new: 'blitz needle', old: 'blitz', exclude: 'needle' },
  { new: 'caladbolg', old: 'calad', exclude: 'bolg' },
  { new: 'ctr med', old: 'ctr m', exclude: 'ctr med' },
  { new: 'ctr high', old: 'ctr h', exclude: 'ctr high' },
  { new: 'asi med', old: 'asi m', exclude: 'asi med' },
  { new: 'asi high', old: 'asi h', exclude: 'asi high' },
  { new: 'asi very high ctr very high', old: 'ctr very high asi very high', exclude: null },
  { new: ' asi high ctr very high', old: ' lite gm', exclude: null },
  { new: 'asi high ctr very high ', old: 'lite gm ', exclude: null },
  { new: ' asi high ctr very high', old: ' gm lite', exclude: null },
  { new: 'asi high ctr very high ', old: 'gm lite ', exclude: null },
  { new: ' asi very high ctr very high', old: ' gm', exclude: null },
  { new: 'asi very high ctr very high ', old: 'gm ', exclude: null },
  { new: 'med', old: 'medium', exclude: null },
  { new: 'very high', old: 'vhigh', exclude: null },
  { new: 'max', old: 'maximum', exclude: null },
  { new: 'black kat ', old: 'bk ', exclude: null },
  { new: 'black kat cowl', old: 'bkc', exclude: null },
  { new: 'black kat raiment', old: 'bkr', exclude: null },
  { new: 'black kat mail', old: 'bkm', exclude: null },
  { new: 'swiftstrike buckler', old: 'ssb', exclude: null },
  { new: 'barbarous thorn blade', old: 'btb', exclude: null },
  { new: 'receiver', old: 'reciever', exclude: null }
];

const cleanFilter = [
  'ctr high', 'ctr very high', 'asi high', 'asi very high',
  'normal high', 'normal max', 'shadow high', 'shadow max',
  'fire high', 'fire max', 'shock high', 'shock max'
];

const uvTerms = {
  types: ['ctr', 'asi', 'normal', 'shadow', 'fire', 'shock', 'poison', 'stun', 'freeze', 'elemental', 'piercing'],
  grades: ['low', 'med', 'high', 'very', 'max']
}

const commonFeatured = [
  'gloweyes', 'scissor', 'prime bombhead', 'medieval war', 'mixmaster', 'spiral soaker', 'tricorne', 'shogun',
  'tabard of the coral', 'chapeau of the coral', 'tabard of the violet', 'chapeau of the violet',
  'moonlight leafy', 'dead leafy', 'gatecrasher helm', 'snarblepup', 'gun pup', 'love puppy', 'restored',
  'sniped stranger', 'iron shackles', 'tails tails', 'metal sonic'
];

const spreadsheet = [
  'brand', 'glacius', 'combuster', 'voltedge', 'flourish', 'snarble barb', 'thorn blade',
  'sealed sword', 'avenger', 'faust', 'black kat', 'autogun', 'needle', 'chaingun', 'grim reapater',
  'alchemer', 'driver',  'magnus', 'tundrus', 'winter grave', 'iron slug', 'callahan',
  'blaster', 'riftlocker', 'phantamos', 'arcana', 'valiance', 'pulsar', 'wildfire', 'permafroster', 'supernova', 'polaris',
  'antigua', 'raptor', 'silversix', 'blackhawk', 'gilded griffin', 'obsidian carbine', 'sentenza', 'argent peacemaker',
  'blast bomb', 'electron', 'graviton', 'spine cone', 'spike shower', 'dark briar barrage', 'nitronome',
  'vaporizer', 'haze', 'capacitor', 'smogger', 'atomizer', 'slumber squall', 
  'stagger storm', 'voltaic tempest', 'venom veiler', 'torpor tantrum', 'shivermist buster', 'ash of agni'
];

const equipmentFamilies = {
"brandishes": [
  'shockburst brandish', 'iceburst brandish', 'fireburst brandish', 'boltbrand', 'silent nightblade',
  'blizzbrand', 'blazebrand', 'advanced cautery sword', 'obsidian edge', 'voltedge', 'glacius', 'combuster', 'amputator', 'acheron', 'brandish', 'nightblade', 'cautery sword'
],
"flourishes": [
  'twisted snarble barb', 'swift flourish', 'dark thorn blade', 'grand flourish', 
  'fierce flamberge', 'daring rigadoon', 'barbarous thorn blade', 'furious flamberge', 'final flourish', 'fearless rigadoon', 'flourish', 'snarble barb', 'rigadoon', 'flamberge'
],
"troikas": [
  'troika', 'grintovec', 'kamarin', 'jalovec', 'khorovod', 'triglav', 'sudaruska'
],
"spurs": [
  'spur', 'arc razor', 'winmillion', 'turbillion'
],
"cutters": [
  'cutter', 'vile striker', 'dread venom striker', 'wild hunting blade', 'striker', 'hunting blade'
],
"caliburs": [
  'tempered calibur', 'cold iron carver', 'ascended calibur', 'leviathan blade', 'cold iron vanquisher', 'calibur'
],
"sealed swords": [
  'sealed sword', 'gran faust', 'faust', 'divine avenger', 'avenger'
],
"pulars": [
  'freezing pulsar', 'flaming pulsar', 'kilowatt pulsar', 'heavy pulsar', 'frozen pulsar',
  'blazing pulsar','radiant pulsar', 'gigawatt pulsar', 'wildfire', 'permafroster', 'supernova', 'polaris', 'pulsar'
],
"catalyzers": [
  'toxic catalyzer', 'industrial catalyzer', 'volatile catalyzer', 'virulent catalyzer', 'neutralizer', 'biohazard', 'catalyzer'
],
"alchemers": [
   'shadowtech alchemer mk ii', 'prismatech alchemer mk ii', 'firotech alchemer mk ii', 'cryotech alchemer mk ii', 'volt driver',
  'shadow driver', 'prisma driver', 'firo driver', 'cryo driver', 'umbra driver', 'storm driver', 'nova driver', 'magma driver',
  'hail driver', 'voltech alchemer', 'shadowtech alchemer', 'prismatech alchemer', 'firotech alchemer', 'cryotech alchemer'
],
"autoguns": [
  'autogun', 'dark chaingun', 'toxic needle', 'needle shot', 'black chaingun','blight needle',
  'strike needle', 'fiery pepperbox', 'grim repeater', 'plague needle', 'volcanic pepperbox', 'blitz needle', 'pepperbox'
],
"blasters": [
  'shadow blaster', 'pierce blaster', 'elemental blaster', 'super blaster', 'umbral blaster', 
  'fusion blaster', 'breach blaster', 'master blaster', 'riftlocker', 'phantamos', 'arcana', 'valiance', 'blaster'
],
"magnuses": [
  'mega tundrus', 'mega magnus', 'iron slug', 'winter grave', 'callahan', 'tundrus', 'magnus'
],
"torto guns": [
  'wild buster', 'stoic buster', 'primal buster', 'grim buster', 'nether cannon', 'mighty cannon', 
  'feral cannon', 'barrier cannon', 'savage tortofist', 'omega tortofist', 'grand tortofist', 'gorgofist'
],
"antiguas": [
  'antigua', 'raptor', 'silversix', 'blackhawk', 'gilded griffin', 'obsidian carbine', 'sentenza', 'argent peacemaker'
],
"shard bombs": [
  'super splinter bomb', 'super shard bomb', 'super dark matter bomb', 'super crystal bomb', 'rock salt bomb', 'radiant sun shards',
  'ionized salt bomb', 'heavy splinter bomb', 'heavy shard bomb', 'heavy dark matter bomb', 'heavy crystal bomb',
  'shocking salt bomb', 'scintillating sun shards', 'deadly splinter bomb', 'deadly shard bomb', 'deadly dark matter bomb',
  'deadly crystal bomb', 'splinter bomb', 'shard bomb', 'dark matter bomb', 'crystal bomb', 'sun shards'
],
"mist bombs": [ 
  'haze bomb mk ii', 'lightning capacitor', 'toxic vaporizer mk ii', 'slumber smogger mk ii', ' freezing vaporizer mk ii',
  'fiery vaporizer mk ii', 'haze burst', 'plasma capacitor', 'toxic atomizer', 'slumber squall', 'freezing atomizer',
  'fiery atomizer', 'stagger storm', 'voltaic tempest', 'venom veiler', 'torpor tantrum', 'shivermist buster', 'ash of agni',
  'haze bomb', 'static capacitor', 'toxic vaporizer', 'slumber smogger', 'freezing vaporizer', 'fiery vaporizer'
],
"snarb bombs": [
  'twisted spine cone', 'spike shower', 'dark briar barrage', 'spine cone'
],
"blast bombs": [
  'super blast bomb', 'master blast bomb', 'irontech bomb', 
  'heavy deconstructor', 'nitronome', 'irontech destroyer', 'big angry bomb', 'blast bomb', 'deconstructor'
],
"vortexes 1": [
  'electron charge', 'electron bomb', 'electron vortex'
],
"vortexes 2": [
  'graviton charge', 'graviton bomb', 'obsidian crusher', 'graviton vortex'
],
"wolver set": [
  'wolver coat', 'padded hunting coat', 'dusker coat', 'quilted hunting coat', 'ash tail coat', 'vog cub coat',
  'starlit hunting coat', 'snarbolax coat', 'skolver coat', 'wolver cap', 'padded hunting cap', 'dusker cap',
  'quilted hunting cap', 'ash tail cap', 'vog cub cap', 'starlit hunting cap', 'snarbolax cap', 'skolver cap'
],
"cloak sets": [
  'magic cloak', 'elemental cloak', 'miracle cloak', 'chaos cloak', 'divine mantle', 'grey feather mantle',
  'magic hood', 'elemental hood', 'miracle hood', 'chaos cowl', 'divine veil', 'grey feather cowl'
],
"kat sets": [
  'kat hiss cloak', 'kat hiss mail', 'kat hiss raiment', 'kat hiss hood', 'kat hiss mask', 'kat hiss cowl',
  'kat eye cloak', 'kat eye mail', 'kat eye raiment', 'kat eye hood', 'kat eye mask', 'kat eye cowl',
  'kat claw cloak', 'kat claw mail', 'kat claw raiment', 'kat claw hood', 'kat claw mask', 'kat claw cowl'
],
"bkat cloaks": [
  'black kat cloak', 'black kat mail', 'black kat raiment'
],
"gunslinger sets": [
  'gunslinger sash', 'sunset duster', 'deadshot mantle', 'justifier jacket', 'nameless poncho', 'shadowsun slicker',
  'gunslinger hat', 'sunset stetson', 'deadshot chapeau', 'justifier hat', 'nameless hat', 'shadowsun stetson'
],
"demo sets": [
  'spiral demo suit', 'fused demo suit', 'padded demo suit', 'heavy demo suit', 'quilted demo suit', 'bombastic demo suit', 'mad bomber suit',
  'mercurial demo suit', 'volcanic demo suit', 'starlit demo suit', 'spiral demo helm', 'fused demo helm', 'padded demo helm', 'heavy demo helm',
  'quilted demo helm', 'bombastic demo helm', 'mad bomber mask', 'mercurial demo helm', 'volcanic demo helm', 'starlit demo helm'
],
"skelly sets": [
  'skelly suit', 'scary skelly suit', 'sinister skelly suit', 'dread skelly suit',
  'skelly mask', 'scary skelly mask', 'sinister skelly mask', 'dread skelly mask'
],
"cobalt sets": [
  'solid cobalt armor', 'mighty cobalt armor', 'azure guardian armor', 'almirian crusador armor', 'cobalt amor',
  'solid cobalt helm', 'mighty cobalt helm', 'azure guardian helm', 'almirian crusader helm', 'cobalt helm'
],
"jelly sets": [
  'brute jelly mail', 'rock jelly mail', 'ice queen mail', 'royal jelly mail',
  'brute jelly helm', 'rock jelly helm', 'ice queen crown', 'royal jelly crown', 'jelly helm', 'jelly mail',
  'charged quicksilver mail', 'mercurial mail', 'charged quicksilver helm', 'mercurial helm', 'quicksilver mail', 'quicksilver helm'
],
"plate sets": [
  'spiral plate mail', 'boosted plate mail', 'heavy plate mail', 'ironmight plate mail', 'volcanic plate mail',
  'spiral plate helm', 'boosted plate helm', 'heavy plate helm', 'ironmight plate helm', 'volcanic plate helm'
],
"chroma sets": [
  'chroma suit', 'arcane salamander suit', 'volcanic salamander suit', 'deadly virulisk suit', 'salamander suit', 'virulisk suit',
  'chroma mask', 'arcane salamander mask', 'volcanic salamander mask', 'deadly virulisk mask', 'salamander mask', 'virulisk mask'
],
"angelic sets": [
  'angelic raiment', 'seraphic mail', 'armor of the fallen', 'heavenly iron armor', 'valkyrie mail',
  'angelic helm', 'seraphic helm', 'crown of the fallen', 'heavenly iron helm', 'valkyrie helm'
],
"scale sets": [
  'drake scale mail', 'wyvern scale mail', 'silvermail', 'dragon scale mail',
  'radiant silvermail','drake scale helm', 'wyvern scale helm', 'dragon scale helm'
],
"pathfinder sets": [
  'woven falcon pathfinder armor', 'woven firefly pathfinder armor', 'woven grizzle pathfinder armor',
  'woven snakebite pathfinder armor', 'plated falcon pathfinder armor', 'plated firefly pathfinder armor', 'plated grizzly pathfinder armor',
  'plated snakebite pathfinder armor', 'sacred falcon pathfinder armor', 'sacred falcon guerrila armor', 'sacred falcon hazard armor',
  'sacred firefly pathfinder armor', 'sacred firefly guerilla armor', 'sacred firefly hazard armor', 'sacred grizzly pathfinder armor',
  'sacred grizlly guerilla armor', 'sacred grizzly hazard armor', 'sacred snakebite pathfinder armor', 'sacred snakebite guerilla armor',
  'sacred snakebite hazard armor', 'woven falcon pathfinder helm', 'woven firefly pathfinder helm',
  'woven grizzly pathfinder helm', 'woven snakebite pathfinder helm', 'plated falcon pathfinder helm', 'plated firefly pathfinder helm',
  'plated grizzly pathfinder helm', 'plated snakebite pathfinder helm', 'sacred falcon pathfinder helm', 'sacred falcon guerilla helm',
  'sacred falcon hazard helm', 'sacred firefly pathfinder helm', 'sacred firefly guerilla helm', 'sacred firefly hazard helm',
  'sacred grizzly pathfinder helm', 'sacred grizzly guerilla helm', 'sacred grizzly hazard helm', 'sacred snakebite pathfinder helm',
  'sacred snakebite guerilla helm', 'sacred snakebite hazard helm', 'pathfinder armor', 'pathfinder helm'
],
"sentinel sets": [
  'woven falcon sentinel armor', 'woven firefly sentinel armor', 'woven grizzly sentinel armor', 'woven snakebite sentinel armor',
  'plated falcon sentinel armor', 'plated firefly sentinel armor', 'plated grizzly sentinel armor', 'plated snakebite sentinel armor',
  'sacred falcon sentinel armor', 'sacred falcon keeper armor', 'sacred falcon wraith armor', 'sacred firefly sentinel armor',
  'sacred firefly keeper armor', ' sacred firefly wraith armor', 'sacred grizzly sentinel armor', 'sacred grizzly keeper armor',
  'sacred grizzly wraith armor', 'sacred snakebite sentinel armor', 'sacred snakebite keeper armor', 'sacred snakebite wraith armor',
  'woven falcon sentinel helm', 'woven firefly sentinel helm', 'woven grizzly sentinel helm', 'woven snakebite sentinel helm',
  'plated falcon sentinel helm', 'plated firefly sentinel helm', 'plated grizzly sentinel helm', 'plated snakebite sentinel helm',
  'sacred falcon sentinel helm', 'sacred falcon keeper helm', 'sacred falcon wraith helm', 'sacred firefly sentinel helm',
  'sacred firefly keeper helm', 'sacred firefly wraith helm', 'sacred grizzly sentinel helm', 'sacred grizzly keeper helm',
  'sacred grizzly wraith helm', 'sacred snakebite sentinel helm', 'sacred snakebite keeper helm', 'sacred snakebite wraith helm',
  'sentinel armor', 'sentinel helm'
],
"shade sets": [
  'woven falcon shade armor', 'woven firefly shade armor', 'woven grizzly shade armor', 'woven snakebite shade armor',
  'plated falcon shade armor', 'plated firefly shade armor', 'plated grizzly shade armor', 'plated snakebite shade armor',
  'sacred falcon shade armor', 'sacred falcon ghost armor', 'sacred falcon hex armor', 'sacred firefly shade armor', 'sacred firefly ghost armor',
  'sacred firefly hex armor', 'sacred grizzly shade armor', 'sacred grizzly ghost armor', 'saccred grizzly hex armor',
  'sacred snakebite shade armor', 'sacred snakebite gohst armor', 'sacred snakebite hex armor', 'woven falcon shade helm',
  'woven firefly shade helm', 'woven grizzly shade helm', 'woven snakebite shade helm', 'plated falcon shade helm', 'plated firefly shade helm',
  'plated grizzly shade helm', 'plated snakebite shade helm', 'sacred falcon shade helm', 'sacred falcon ghost helm', 'sacred falcon hex helm',
  'sacred firefly shade helm', 'sacred firefly ghost helm', 'sacred firefly hex helm', 'sacred grizzly shade helm', 'sacred grizzly ghost helm',
  'sacred grizzly hex helm', 'sacred snakebite shade helm', 'sacred snakebite ghost helm', 'sacred snakebite hex helm',
  'shade armor', 'shade helm'
],
"snarb shields": [
  'bristling buckler', 'twisted targe', 'dark thorn shield', 'barbarous thorn shield'
],
"skelly shields": [
  'scary skelly shield', 'sinister skelly shield', 'dread skelly shield', 'skelly shield'
],
"plate shields": [
  'boosted plate shield', 'heavy plate shield', 'ironmight plate shield', 'volcanic plate shield', 'plate shield'
],
"owlite shields": [
  'horned owlite shield', 'wise owlite shield', 'grey owlite shield', 'owlite shield'
],
"jelly shields": [
  'brute jelly shield', 'rock jelly shield', 'royal jelly shield', 'jelly shield'
],
"defenders": [
  'great defender', 'mighty defender', 'aegis', 'heater shield', 'defender'
],
"scale shields": [
  'drake scale shield', 'wyvern scale shield', 'stone tortoise', 'dragon scale shield', 'omega shell'
],
"torto shields": [
  'wild shell', 'feral shell', 'savage tortoise', 'grim shell', 'nether shell', 'gorgomega',
  'stoic shell','mighty shell', 'grand tortoise', 'primal shell', 'barrier shell', 'omegaward'
]};

const colorSets = {
"standard": [
  'cool', 'dusky', 'fancy', 'heavy', 'military', 'regal', 'toasty'
],
"div volc": [
  'divine', 'volcanic'
],
"gems": [
  'ruby', 'peridot', 'sapphire', 'opal', 'citrine' ,'turquoise' , 'garnet', 'amethyst', 'aquamarine', 'diamond', 'emerald', 'pearl'
],
"shadowtech": [
  'shadowtech blue', 'shadowtech green', 'shadowtech orange', 'shadowtech pink'
],
"tech": [
  'tech blue', 'tech green', 'tech orange', 'tech pink'
],
"snipes": [
  'fern', 'lavender', 'lemon', 'peach', 'rose', 'sky', 'vanilla', 'cocoa', 'cherry', 'lime', 'mint', 'plum', 'sage', 'wheat'
],
"winterfest onesies": [
  'candy striped', 'festively striped', 'holly striped', 'joyous striped'
],
"winterfest pullovers": [
  'flashy winter', 'garish winter', 'gaudy winter', 'tacky winter'
],
"kat suits": [
  'feral kat', 'primal kat', 'savage kat', 'wild kat'
],
"polar colors": [
  'polar day', 'polar night', 'polar twilight'
],
"buhgok tails": [
  'black buhgok', 'brown buhgok', 'gold buhgok'
],
"fowls": [
  'black fowl', 'brown fowl', 'gold fowl'
],
"buckled coats": [
  'ancient gold', 'hunter gold', 'peridot gold'
],
"clovers": [
  'ancient clover', 'hunter clover', 'peridot clover'
],
"lapel clover": [
  'ancient lapel', 'hunter lapel', 'peridot lapel'
],
"lucky toppers": [
  'ancient lucky', 'hunter lucky', 'peridot lucky'
],
"lucky pipes": [
  'ancient pipe', 'hunter pipe', 'peridot pipe'
],
"lucky beards": [
  'autumn lumberfell', 'citrine lumberfell', 'dazed lumberfell'
],
"obsidian": [
  'influence', 'devotion', 'rituals', 'sight'
],
"raider": [
  'winter raider', 'squall raider', 'firestorm raider'
],
"battle chef 1": [
  'black battle', 'white battle'
],
"battle chef 2": [
  'blue battle', 'red battle'
],
"battle chef 3": [
  'pink battle', 'purple battle', 'yellow battle'
],
"rose 1": [
  'the black rose', 'the white rose'
],
"rose 2": [
  'the gold rose', 'the green rose', 'the blue rose', 'the red rose'
],
"rose 3": [
  'the amethyst rose', 'the aquamarine rose', 'the citrine rose', 'the garnet rose', 'the malachite rose', 'the moonstone rose', 'the turquoise rose'
],
"rose 4": [
  'the coral rose', 'the violet rose'
]};

const roses = [
  'black', 'red', 'white', 'blue', 'gold', 'green', 'coral', 'violet', 'moonstone', 
  'malachite', 'garnet', 'amethyst', 'citrine', 'prismatic', 'aquamarine', 'turquoise'
];

const gemExceptions = [
  'bout', 'rose', 'tabard', 'chaeau', 'buckled', 'clover', 'pipe', 'lumberfell'
];

module.exports = {
  channels,
  filters,
  cleanFilter,
  uvTerms,
  commonFeatured,
  spreadsheet,
  equipmentFamilies,
  colorSets,
  roses,
  gemExceptions
}