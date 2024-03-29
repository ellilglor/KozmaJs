const boxes = new Map([
  ['Copper', { price: 750, currency: 'energy',
    url: 'https://media3.spiralknights.com/wiki-images/f/f2/Usable-Copper_Lockbox_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069744452291264715/Copper.gif',
    page: 'https://docs.google.com/spreadsheets/d/14FQWsNevL-7Uiiy-Q3brif8FaEaH7zGGR2Lv_JkOyr8/htmlview#' }],
  ['Steel',{ price: 750, currency: 'energy',
    url: 'https://media3.spiralknights.com/wiki-images/3/3f/Usable-Steel_Lockbox_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069744452610048120/Steel.gif',
    page: 'https://docs.google.com/spreadsheets/d/14FQWsNevL-7Uiiy-Q3brif8FaEaH7zGGR2Lv_JkOyr8/htmlview#' }],
  ['Silver',{ price: 750, currency: 'energy', 
    url: 'https://media3.spiralknights.com/wiki-images/b/bb/Usable-Silver_Lockbox_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069744451938963557/Silver.gif',
    page: 'https://docs.google.com/spreadsheets/d/14FQWsNevL-7Uiiy-Q3brif8FaEaH7zGGR2Lv_JkOyr8/htmlview#' }],
  ['Platinum',{ price: 750, currency: 'energy', 
    url: 'https://media3.spiralknights.com/wiki-images/1/1b/Usable-Platinum_Lockbox_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069744453935452191/Platinum.gif', 
    page: 'https://docs.google.com/spreadsheets/d/14FQWsNevL-7Uiiy-Q3brif8FaEaH7zGGR2Lv_JkOyr8/htmlview#' }],
  ['Gold',{ price: 750, currency: 'energy',
    url: 'https://media3.spiralknights.com/wiki-images/6/62/Usable-Gold_Lockbox_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069744451586637885/Gold.gif',
    page: 'https://docs.google.com/spreadsheets/d/14FQWsNevL-7Uiiy-Q3brif8FaEaH7zGGR2Lv_JkOyr8/htmlview#' }],
  ['Titanium',{ price: 750, currency: 'energy',
    url: 'https://media3.spiralknights.com/wiki-images/2/2f/Usable-Titanium_Lockbox_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069744454283559033/Titanium.gif',
    page: 'https://docs.google.com/spreadsheets/d/14FQWsNevL-7Uiiy-Q3brif8FaEaH7zGGR2Lv_JkOyr8/htmlview#' }],
  ['Iron',{ price: 750, currency: 'energy',
    url: 'https://media3.spiralknights.com/wiki-images/e/ed/Usable-Iron_Lockbox_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069744453239177399/Iron.gif',
    page: 'https://docs.google.com/spreadsheets/d/14FQWsNevL-7Uiiy-Q3brif8FaEaH7zGGR2Lv_JkOyr8/htmlview#' }],
  ['Mirrored',{ price: 750, currency: 'energy',
    url: 'https://media3.spiralknights.com/wiki-images/8/80/Usable-Mirrored_Lockbox_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069744453562155109/Mirrored.gif',
    page: 'https://docs.google.com/spreadsheets/d/14FQWsNevL-7Uiiy-Q3brif8FaEaH7zGGR2Lv_JkOyr8/htmlview#' }],
  ['Slime',{ price: 750, currency: 'energy',
    url: 'https://media3.spiralknights.com/wiki-images/9/97/Usable-Slime_Lockbox_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069744452937207955/Slime.gif',
    page: 'https://docs.google.com/spreadsheets/d/1f9KQlDcQcoK3K2z6hc7ZTWD_SnrikdTkTXGppneq0YU/htmlview#' }],
  ['Equinox',{ price: 4.95, currency: '$',
    url: 'https://media3.spiralknights.com/wiki-images/5/5e/Usable-Equinox_Prize_Box_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069736605075652608/Equinox.gif',
    page: 'https://wiki.spiralknights.com/Equinox_Prize_Box_Promotion_September_2022' }],
  ['Confection',{ price: 4.95, currency: '$',
    url: 'https://media3.spiralknights.com/wiki-images/a/a4/Usable-Confection_Prize_Box_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069736605474107462/Confection.gif',
    page: 'https://wiki.spiralknights.com/Confection_Prize_Box_Promotion_August_2014' }],
  ['Spritely',{ price: 4.95, currency: '$',
    url: 'https://media3.spiralknights.com/wiki-images/9/90/Usable-Spritely_Prize_Box_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069736604689760276/Spritely.gif',
    page: 'https://wiki.spiralknights.com/Spritely_Prize_Box_Promotion_June_2015' }],
  ['Polar',{ price: 4.95, currency: '$',
    url: 'https://media3.spiralknights.com/wiki-images/6/6c/Usable-Polar_Prize_Box_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1074382088016515123/Polar.gif',
    page: 'https://wiki.spiralknights.com/Polar_Prize_Box_Promotion_February_2023' }],
  ['Lucky',{ price: 3495, currency: 'energy',
    url: 'https://media3.spiralknights.com/wiki-images/e/e7/Usable-Lucky_Prize_Box_icon.png',
    gif: 'https://cdn.discordapp.com/attachments/1069643121622777876/1069736605822238781/Lucky.gif',
    page: 'https://wiki.spiralknights.com/Lucky_Prize_Box_Promotion_March_2022' }]
]);

module.exports = {
  boxes
}