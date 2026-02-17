# OrderXpress - Quick Image Generation Guide

## 🚀 Quick Start: Generate Images in 3 Steps

### Step 1: Open Google Gemini

Go to [Google Gemini](https://gemini.google.com/) and ensure you're using a model that supports image generation.

### Step 2: Copy & Paste Prompts

Use the prompts below (or from `IMAGE_GENERATION_PROMPTS.md` for detailed versions).

### Step 3: Save to Public Folder

Save each generated image with the exact filename to the `public/` folder.

---

## 📋 Quick Prompts (Copy-Paste Ready)

### 🍔 FOOD

**1. Cheeseburger** → `classic-beef-burger.png`

```
Photorealistic cheeseburger with sesame bun, beef patty, melted cheese, lettuce, tomato, pickles. Professional food photography, bright lighting, white background, 45-degree angle, ultra high resolution, appetizing.
```

**2. Pepperoni Pizza** → `delicious-pizza.png`

```
Photorealistic pepperoni pizza, whole pizza with one slice pulled showing cheese stretch, golden crust, melted mozzarella, basil garnish. Professional food photography, warm lighting, white background, top-down view, ultra high resolution.
```

**3. Caesar Salad** → `vibrant-mixed-salad.png`

```
Photorealistic Caesar salad in white bowl, crisp romaine lettuce, croutons, parmesan shavings, creamy dressing, cherry tomatoes. Professional food photography, bright lighting, white background, 45-degree angle, fresh and vibrant.
```

**4. Chicken Wings** → `crispy-chicken-wings.png`

```
Photorealistic crispy chicken wings on white plate, golden-brown, buffalo sauce glaze, ranch dressing side, celery sticks. Professional food photography, warm lighting, white background, 45-degree angle, ultra crispy texture.
```

**5. French Fries** → `crispy-french-fries.png`

```
Photorealistic golden french fries in paper cone, perfect golden color, sea salt, ketchup on side. Professional food photography, bright lighting, white background, 45-degree angle, crispy texture visible.
```

---

### 🥤 DRINKS

**6. Coca Cola** → `refreshing-cola.png`

```
Photorealistic glass of cola with ice cubes, bubbles rising, condensation on glass, striped straw, lemon slice. Professional beverage photography, bright lighting, white background, straight-on view, ultra refreshing.
```

**7. Iced Tea** → `iced-tea.png`

```
Photorealistic iced tea in tall glass, amber color, ice cubes, lemon slices, mint garnish, condensation droplets. Professional beverage photography, natural lighting, white background, slight angle, refreshing.
```

**8. Orange Juice** → `glass-of-orange-juice.png`

```
Photorealistic fresh orange juice in glass, vibrant orange color, pulp visible, orange slice garnish, condensation. Professional beverage photography, bright lighting, white background, slight angle, fresh and vitamin-rich.
```

**9. Latte Coffee** → `latte-coffee.png`

```
Photorealistic latte in white cup, beautiful latte art (heart pattern), microfoam, coffee beans on saucer, steam rising. Professional coffee photography, warm lighting, white background, 45-degree angle, inviting.
```

**10. Bottled Water** → `bottled-water.png`

```
Photorealistic water bottle, crystal clear water, blue cap, condensation droplets, clean label. Professional product photography, bright lighting, white background, straight-on view, pure and refreshing.
```

---

### 🍰 DESSERTS

**11. Chocolate Cake** → `chocolate-cake-slice.png`

```
Photorealistic chocolate cake slice on white plate, multiple layers, chocolate frosting, chocolate shavings on top, fork beside. Professional dessert photography, warm lighting, white background, 45-degree angle showing layers, indulgent.
```

**12. Cheesecake** → `cheesecake-slice.png`

```
Photorealistic New York cheesecake slice, graham cracker crust, smooth creamy filling, strawberry sauce, fresh strawberries, mint leaf. Professional dessert photography, soft lighting, white background, 45-degree angle, smooth and creamy.
```

**13. Ice Cream Sundae** → `ice-cream-sundae.png`

```
Photorealistic ice cream sundae in tall glass, vanilla scoops, chocolate sauce, whipped cream, cherry on top, sprinkles, wafer stick. Professional dessert photography, bright lighting, white background, slight angle, cold and delicious.
```

**14. Apple Pie** → `apple-pie-slice.png`

```
Photorealistic apple pie slice, golden flaky crust with lattice top, apple filling, vanilla ice cream melting on side, cinnamon stick. Professional dessert photography, warm lighting, white background, 45-degree angle, warm and comforting.
```

**15. Chocolate Brownie** → `chocolate-brownie.png`

```
Photorealistic fudgy chocolate brownie square, crackled top, chocolate chips, powdered sugar, vanilla ice cream on side, chocolate sauce drizzle. Professional dessert photography, warm lighting, white background, 45-degree angle, dense and chocolatey.
```

---

## ✅ Checklist

After generating all images:

- [ ] All 15 images generated
- [ ] Images saved with exact filenames
- [ ] Images placed in `public/` folder
- [ ] Images are 1024x1024 pixels (or similar square ratio)
- [ ] File sizes optimized (< 500KB each)
- [ ] Dev server restarted to see changes

---

## 🎯 Pro Tips

1. **Batch Generation**: Generate all food items first, then drinks, then desserts for consistency
2. **Variations**: Generate 2-3 versions of each and pick the best
3. **Editing**: Use image editing tools to adjust brightness/contrast if needed
4. **Compression**: Use tools like TinyPNG to optimize file sizes
5. **Consistency**: Try to maintain similar lighting and style across all images

---

## 🔧 Troubleshooting

**Images not showing?**

- Check filename spelling (case-sensitive)
- Ensure images are in `public/` folder (not in a subfolder)
- Restart the dev server (`npm run dev`)
- Clear browser cache

**Image quality issues?**

- Request higher resolution in prompt
- Add "ultra high resolution" or "8K quality" to prompts
- Regenerate with more specific details

---

**Happy Image Generating! 🎨**

For detailed prompts with more specifications, see `IMAGE_GENERATION_PROMPTS.md`
