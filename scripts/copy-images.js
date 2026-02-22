const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\Basudev\\.gemini\\antigravity\\brain\\406a150c-3b91-4822-a102-a3f8937a6f2b";
const publicDir = "c:\\Users\\Basudev\\Desktop\\OrderXpress\\public";

const files = fs.readdirSync(brainDir);

const mapping = [
  // New ones
  { prefix: "pink_sauce_pasta_", newName: "pink-pasta.png" },
  { prefix: "butter_chicken_", newName: "butter-chicken.png" },
  { prefix: "chicken_biryani_", newName: "chicken-biryani.png" },
  { prefix: "paneer_tikka_masala_", newName: "paneer-tikka.png" },
  { prefix: "chicken_momo_", newName: "chicken-momo.png" },
  { prefix: "saffron_rasmalai_", newName: "rasmalai.png" },
  { prefix: "tiramisu_", newName: "tiramisu.png" },
  { prefix: "dal_makhani_", newName: "dal-makhani.png" },
  { prefix: "veggie_pizza_", newName: "veggie-pizza-new.png" },
  { prefix: "chinese_bhel_", newName: "chinese-bhel.png" },
  { prefix: "chicken_pakora_", newName: "chicken-pakora.png" },
  { prefix: "lasagna_", newName: "lasagna.png" },
  { prefix: "cheese_balls_", newName: "cheese-balls.png" },
  // Old ones
  { prefix: "cheesecake_slice_", newName: "ny-cheesecake.png" },
  { prefix: "crispy_chicken_wings_", newName: "peri-peri-wings.png" },
  { prefix: "crispy_french_fries_", newName: "french-fries.png" },
  { prefix: "latte_coffee_", newName: "masala-chai.png" },
  { prefix: "iced_tea_", newName: "shikanji.png" },
  { prefix: "refreshing_cola_", newName: "virgin-mojito.png" },
  { prefix: "glass_of_orange_juice_", newName: "mango-lassi.png" },
  { prefix: "chocolate_cake_slice_", newName: "gulab-jamun.png" },
  { prefix: "chocolate_brownie_", newName: "gajar-halwa.png" },
  { prefix: "vibrant_mixed_salad_", newName: "crispy-baby-corn.png" },
  { prefix: "ice_cream_sundae_", newName: "mango-souffle.png" }
];

for (const m of mapping) {
  // sort by modified time to get latest if multiple exist
  const matches = files.filter(f => f.startsWith(m.prefix) && f.endsWith(".png"));
  if (matches.length > 0) {
    const latest = matches.sort().reverse()[0];
    fs.copyFileSync(path.join(brainDir, latest), path.join(publicDir, m.newName));
    console.log(`Copied ${latest} to ${m.newName}`);
  } else {
    console.log(`Could not find file for ${m.prefix}`);
  }
}
// Manually copy one duplicate for lavender lemonade
fs.copyFileSync(path.join(publicDir, "virgin-mojito.png"), path.join(publicDir, "lavender-lemonade.png"));
console.log("Copied duplicate for lavender lemonade");
