const boxes = new Map([
  ['Colors','- **97.85%** for Cool, Regal, Military, Heavy, Fancy, Dusky or Toasty.\n- **1.96%** for Divine or Volcanic\n- **0.19%** for Prismatic.'], 
  ['Copper',`- **1.92%** for a Shadow Key.\n- **76.78%** for Binoculars, Flower, Headband or Plume.\n- **19.19%** for Long Feather or Pipe.\n- **3.84%** for Wolver tail or Prismatic glow-eyes.\n- **0.19%** for Twinkle Aura or Twilight Aura.`],
  ['Steel',`- **1.92%** for a Shadow Key.\n- **76.78%** for Bolted Vee, Wide Vee, Mecha Wings or Game Face.\n- **19.19%** for Vertical Vents or Spike Mohawk.\n- **3.84%** for Ankle Booster or Aero Fin.\n- **0.19%** for Shoulder Booster or Flame Aura.`],
  ['Silver',`- **1.92%** for a Shadow Key.\n- **76.78%** for Vitakit, Targeting Module, Binocular Visor or Helm-Mounted Display.\n- **19.19%** for Maedate or Intel Tube.\n- **3.84%** for Giga Shades.\n- **0.19%** for Wings (50%) or Divine/Volcanic/Prismatic Halo (50%).`],
  ['Platinum',`- **1.92%** for a Shadow Key.\n- **76.78%** for Com Unit, Knight Vision Goggles or Goggles.\n- **19.19%** for Sensor Unit or Bomb Bandolier.\n- **3.84%** for Mohawk, Devious Horns or Scarf.\n- **0.19%** for Unclean Aura or Ghostly Aura.`],
  ['Gold',`- **1.92%** for a Shadow Key.\n- **76.78%** for Canteen, Ribbon or Maid Headband.\n- **19.19%** for Monocle or Glasses.\n- **3.84%** for Mustache or Round Shades.\n- **0.19%** for Dapper Combo or Toupee.`],
  ['Titanium',`- **1.92%** for a Shadow Key.\n- **76.78%** for Helm Guards, Munitions Pack, Barrel Belly or Vented Visor.\n- **19.19%** for Headlamp or Side Blade.\n- **3.84%** for Rebreather or Parrying Blade.\n- **0.19%** for Vial Bandolier.`],
  ['Iron',`- **1.92%** for a Shadow Key.\n- **20% for one of the following:**\n - **76.78%** for Vitakit, Canteen or Barrel Belly.\n - **19.19%** for Side Blade or Bomb Bandolier.\n - **3.84%** for Wolver Tail or Parrying Blade.\n - **0.19%** with **50%** for Wings and **50%** to get an Aura: **27.78%** for Twinkle, Ghostly and Unclean. **13.89%** for Twilight & **2.77%** for Flame.\n- **80% for one of the following:**\n - **76.78%** for Plume, Ribbon, Vented Visor, Binocular Visor, Knight Vision Goggles, Helm-Mounted Display, Goggles, Com Unit, Mecha Wings, Helm Guards, Bolted Vee, Headband, Wide Vee, Maid Headband or Flower.\n - **19.19%** for Long Feather, Vertical Vents, Pipe, Glasses or Maedate.\n - **3.84%** with **24.39%** for Scarf, Mustache and Mohawk and **2.44%** for Prismatic Glow-Eyes.\n - **0.19%** with **43.48%** for Dapper Combo and Toupee & **13.04%** for Divine/Volcanic/Prismatic Halo.`],
  ['Mirrored',`- **90.91%** for the following eyes:\n - Cheeky, Closed, Dot, Exed, Jolly, Delicate, Pill, Plus. Angry, Sad, Shifty, Sleepy, Spiral, Squinty, Sultry, Vacant or Starry.\n- **9.09%** for Extra Short or Extra Tall Height Modifier.`],
  ['Slime',`These are the __estimated__ odds taken from 800+ QQQ box openings:\n- **36.97%** for Node Slime Mask. \n- **30.40%** for Node Slime Guards.\n- **10.80%** for Node Container.\n- **9.47%** for Node Receiver.\n- **3.23%** for Node Slime Crusher.\n- **3.67%** for Node Slime Wall.\n- **1.00%** for Slimed Auras.\n- **1.11%** for Writhing Tendrils.\n- **1.11%** for Early Riser Ring.\n- **0.67%** for Dawn Bracelet.\n- **0.78%** for Daybreaker Band.\n- **0.33%** for Somnambulist's Totem.\n- **0.45%** for Node Field Aura.`],
]);

const slimeBoxes = new Map([
  ['000','The 000 Slime lockbox contains **no special** themed box.'],
  ['001','The 001 Slime lockbox contains **no special** themed box.'],
  ['002','The 002 Slime lockbox contains **no special** themed box.'],
  ['003','The 003 Slime lockbox contains **no special** themed box.'],
  ['004','The 004 Slime lockbox contains **no special** themed box.'],
  ['005','The 005 Slime lockbox contains **no special** themed box.'],
  ['006','The 006 Slime lockbox contains **no special** themed box.'],
  ['007','The 007 Slime lockbox contains **no special** themed box.'],
  ['008','The 008 Slime lockbox contains **no special** themed box.'],
  ['009','The 009 Slime lockbox contains **no special** themed box.'],
  ['40g','The 40G Slime lockbox contains the **Hunter** themed box.'],
  ['41c','The 41C Slime lockbox contains the **Dangerous** themed box.'],
  ['40n','The 40N Slime lockbox contains the **Glacial** themed box.'],
  ['41d','The 41D Slime lockbox contains the **Hazardous** themed box.'],
  ['50e','The 50E Slime lockbox contains the **Wicked** themed box.'],
  ['509','The 509 Slime lockbox contains the **Shadow** themed box.'],
  ['a1j','The A1J Slime lockbox contains the **Pearl** themed box.'],
  ['a16','The A16 Slime lockbox contains the **Opal** themed box.'],
  ['a1a','The A1A Slime lockbox contains the **Amethyst** themed box.'],
  ['a18','The A18 Slime lockbox contains the **Turquoise** themed box.'],
  ['a10','The A10 Slime lockbox contains the **Ruby** themed box.'],
  ['a12','The A12 Slime lockbox contains the **Peridot** themed box.'],
  ['a1b','The A1B Slime lockbox contains **no special** themed box.'],
  ['403','The 403 Slime lockbox contains **no special** themed box.'],
  ['b1b','The B1B Slime lockbox contains the **Aquamarine** themed box.'],
  ['a17','The A17 Slime lockbox contains the **Citrine** themed box.'],
  ['a19','The A19 Slime lockbox contains the **Garnet** themed box.'],
  ['a14','The A14 Slime lockbox contains the **Sapphire** themed box.'],
  ['a1i','The A1I Slime lockbox contains the **Emerald** themed box.'],
  ['a1h','The A1H Slime lockbox contains the **Diamond** themed box.'],
  ['qqq','The QQQ Slime lockbox contains **no special** themed box.']
]);

module.exports = {
  boxes,
  slimeBoxes
}