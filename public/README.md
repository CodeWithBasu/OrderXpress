# OrderXpress Public Assets

This folder contains all public assets for the OrderXpress POS system.

## 📁 Directory Structure

```
public/
├── products/          # Product images
│   ├── food/         # Food category images
│   ├── drinks/       # Drink category images
│   └── desserts/     # Dessert category images
├── logos/            # Brand logos and icons
├── icons/            # UI icons and graphics
└── placeholder.svg   # Default placeholder image
```

## 🖼️ Product Images

All product images should be:

- **Format**: PNG with transparent background (or white background)
- **Resolution**: 1024x1024 pixels (1:1 aspect ratio)
- **File size**: Optimized for web (< 500KB per image)
- **Style**: Photorealistic, professional food photography

### Required Images (15 total):

#### Food (5 images)

1. `classic-beef-burger.png` - Cheeseburger
2. `delicious-pizza.png` - Pepperoni Pizza
3. `vibrant-mixed-salad.png` - Caesar Salad
4. `crispy-chicken-wings.png` - Chicken Wings
5. `crispy-french-fries.png` - French Fries

#### Drinks (5 images)

6. `refreshing-cola.png` - Coca Cola
7. `iced-tea.png` - Iced Tea
8. `glass-of-orange-juice.png` - Orange Juice
9. `latte-coffee.png` - Latte Coffee
10. `bottled-water.png` - Bottled Water

#### Desserts (5 images)

11. `chocolate-cake-slice.png` - Chocolate Cake
12. `cheesecake-slice.png` - Cheesecake
13. `ice-cream-sundae.png` - Ice Cream Sundae
14. `apple-pie-slice.png` - Apple Pie
15. `chocolate-brownie.png` - Chocolate Brownie

## 📝 Usage

Images in the `public` folder are accessed using absolute paths in Next.js:

```tsx
// Example usage
<Image
  src="/classic-beef-burger.png"
  alt="Cheeseburger"
  width={300}
  height={300}
/>
```

## 🎨 Image Generation

For detailed prompts to generate these images using Google Gemini, see:
**`docs/IMAGE_GENERATION_PROMPTS.md`**

## 🔄 Updating Images

To update or add new product images:

1. Generate the image using the prompts in `docs/IMAGE_GENERATION_PROMPTS.md`
2. Save the image with the exact filename specified
3. Place it in the `public/` folder
4. Update the product data in `app/data/products.tsx` if needed
5. Restart the dev server to see changes

## ⚠️ Important Notes

- Filenames must match exactly as referenced in the code (case-sensitive)
- Keep images optimized for web performance
- Use consistent style across all product images
- Maintain 1:1 aspect ratio for best display in the product grid

---

**Project**: OrderXpress POS System  
**Developer**: BASUDEV  
**Last Updated**: February 17, 2026
