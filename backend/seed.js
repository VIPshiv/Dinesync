// backend/seed.js
// Quick seeding script to populate MenuItem collection with sample data if empty.
const fs = require('fs');
const path = require('path');
// Load env from root first, then backend fallback
(() => {
  const candidates = [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '.env')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      require('dotenv').config({ path: p });
  console.log('[seed env] loaded', p);
      break;
    }
  }
})();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

async function run() {
  const uri = process.env.MONGO_URI;
  console.log('[seed] MONGO_URI present:', !!uri, uri ? `(length ${uri.length})` : '');
  if (!uri) {
    console.error('[seed] ERROR: Missing MONGO_URI in .env (root or backend).');
    console.error('Example local value: mongodb://127.0.0.1:27017/restaurantdb');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('[seed] Connected to Mongo');
  } catch (e) {
    console.error('[seed] Connection FAILED:', e.message);
    process.exit(1);
  }
  const count = await MenuItem.countDocuments();
  if (count > 0) {
    console.log(`Menu already has ${count} items. No seeding done.`);
    await mongoose.disconnect();
    return;
  }
  const fullMenu = [
    // Appetizers (1-4)
  { name: 'Truffle Arancini', price: 16, description: 'Crispy risotto balls filled with truffle-infused cheese, served with roasted red pepper aioli and micro herbs.', category: 'appetizers', subcategory: 'Hot Appetizer', ingredients: ['Arborio Rice','Black Truffle','Parmigiano-Reggiano','Red Pepper','Herbs'], spiceLevel: 'mild', dietary: ['vegetarian'], preparationTime: '15 mins', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=781&q=80' },
  { name: 'Charcuterie Board', price: 28, description: 'Artisanal selection of cured meats, aged cheeses, seasonal fruits, nuts, and house-made preserves.', category: 'appetizers', subcategory: 'Sharing Plate', ingredients: ['Prosciutto','Aged Cheddar','Fig Jam','Walnuts','Crackers'], spiceLevel: 'mild', dietary: [], preparationTime: '5 mins', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Stuffed Mushrooms', price: 12, description: 'Button mushrooms stuffed with herb cream cheese and breadcrumbs, baked to golden perfection.', category: 'appetizers', subcategory: 'Vegetarian', ingredients: ['Button Mushrooms','Cream Cheese','Herbs','Breadcrumbs'], spiceLevel: 'mild', dietary: ['vegetarian'], preparationTime: '10 mins', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Bruschetta Trio', price: 14, description: 'Three varieties: classic tomato basil, ricotta & honey, and wild mushroom & truffle oil.', category: 'appetizers', subcategory: 'Vegetarian', ingredients: ['Sourdough','Tomatoes','Ricotta','Honey','Mushrooms'], spiceLevel: 'mild', dietary: ['vegetarian'], preparationTime: '8 mins', image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
    // Starters (5-8)
  { name: 'Pan-Seared Scallops', price: 22, description: 'Diver scallops with cauliflower purée, pancetta crisps, and balsamic reduction drizzle.', category: 'starters', subcategory: 'Seafood Starter', ingredients: ['Diver Scallops','Cauliflower','Pancetta','Balsamic','Microgreens'], spiceLevel: 'mild', dietary: ['gluten-free'], preparationTime: '12 mins', image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Tuna Tartare', price: 19, description: 'Fresh yellowfin tuna with avocado, cucumber, sesame oil, and wasabi cream on crispy wonton.', category: 'starters', subcategory: 'Raw Bar', ingredients: ['Yellowfin Tuna','Avocado','Cucumber','Sesame Oil','Wasabi'], spiceLevel: 'medium', dietary: ['gluten-free'], preparationTime: '10 mins', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Burrata Caprese', price: 18, description: 'Creamy burrata cheese with heirloom tomatoes, fresh basil, and aged balsamic drizzle.', category: 'starters', subcategory: 'Italian', ingredients: ['Burrata','Heirloom Tomatoes','Basil','Balsamic','Extra Virgin Olive Oil'], spiceLevel: 'mild', dietary: ['vegetarian','gluten-free'], preparationTime: '7 mins', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Foie Gras Terrine', price: 32, description: 'House-made foie gras terrine with cherry compote, toasted brioche, and micro herbs.', category: 'starters', subcategory: 'Premium', ingredients: ['Foie Gras','Cherry Compote','Brioche','Micro Herbs'], spiceLevel: 'mild', dietary: [], preparationTime: '8 mins', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
    // Mains (9-14)
  { name: 'Wagyu Beef Tenderloin', price: 68, description: '8oz grass-fed wagyu with roasted bone marrow, seasonal vegetables, and red wine jus.', category: 'mains', subcategory: 'Premium Beef', ingredients: ['Wagyu Beef','Bone Marrow','Root Vegetables','Red Wine','Thyme'], spiceLevel: 'mild', dietary: ['gluten-free'], preparationTime: '25 mins', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Chilean Sea Bass', price: 42, description: 'Miso-glazed sea bass with forbidden black rice, baby bok choy, and ginger-soy reduction.', category: 'mains', subcategory: 'Seafood', ingredients: ['Chilean Sea Bass','Miso Paste','Black Rice','Bok Choy','Ginger'], spiceLevel: 'mild', dietary: ['gluten-free'], preparationTime: '20 mins', image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Duck Confit', price: 38, description: 'Slow-cooked duck leg with cherry gastrique, roasted fingerling potatoes, and seasonal greens.', category: 'mains', subcategory: 'Poultry', ingredients: ['Duck Leg','Cherries','Fingerling Potatoes','Mixed Greens','Herbs'], spiceLevel: 'mild', dietary: ['gluten-free'], preparationTime: '30 mins', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Lobster Ravioli', price: 36, description: 'House-made pasta filled with Maine lobster in a light cream sauce with fresh herbs.', category: 'mains', subcategory: 'Pasta', ingredients: ['Maine Lobster','Fresh Pasta','Cream','Herbs','White Wine'], spiceLevel: 'mild', dietary: [], preparationTime: '18 mins', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=781&q=80' },
  { name: 'Lamb Rack', price: 48, description: 'Herb-crusted New Zealand lamb with ratatouille and rosemary jus.', category: 'mains', subcategory: 'Lamb', ingredients: ['Lamb Rack','Mixed Herbs','Eggplant','Tomatoes','Rosemary'], spiceLevel: 'mild', dietary: ['gluten-free'], preparationTime: '25 mins', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Vegetarian Wellington', price: 28, description: 'Roasted vegetables and mushroom duxelles wrapped in puff pastry with red wine reduction.', category: 'mains', subcategory: 'Vegetarian', ingredients: ['Mixed Vegetables','Mushrooms','Puff Pastry','Red Wine','Herbs'], spiceLevel: 'mild', dietary: ['vegetarian'], preparationTime: '22 mins', image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
    // Desserts (15-19)
  { name: 'Chocolate Soufflé', price: 16, description: 'Dark chocolate soufflé with vanilla bean ice cream and gold leaf garnish. Please allow 20 minutes.', category: 'desserts', subcategory: 'Hot Dessert', ingredients: ['Dark Chocolate','Eggs','Vanilla Ice Cream','Gold Leaf'], spiceLevel: 'mild', dietary: ['vegetarian'], preparationTime: '20 mins', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Tiramisu', price: 12, description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.', category: 'desserts', subcategory: 'Cold Dessert', ingredients: ['Ladyfingers','Espresso','Mascarpone','Cocoa','Marsala'], spiceLevel: 'mild', dietary: ['vegetarian'], preparationTime: '15 mins', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Crème Brûlée', price: 14, description: 'Vanilla custard with caramelized sugar top and fresh berries.', category: 'desserts', subcategory: 'Cold Dessert', ingredients: ['Cream','Vanilla','Sugar','Berries'], spiceLevel: 'mild', dietary: ['vegetarian','gluten-free'], preparationTime: '10 mins', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Lemon Tart', price: 13, description: 'Buttery pastry shell filled with silky lemon curd and topped with torched meringue.', category: 'desserts', subcategory: 'Cold Dessert', ingredients: ['Lemon Curd','Pastry','Meringue','Butter'], spiceLevel: 'mild', dietary: ['vegetarian'], preparationTime: '12 mins', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Chocolate Fondant', price: 15, description: 'Warm chocolate cake with molten center, served with raspberry coulis and vanilla ice cream.', category: 'desserts', subcategory: 'Hot Dessert', ingredients: ['Dark Chocolate','Butter','Eggs','Raspberry','Vanilla Ice Cream'], spiceLevel: 'mild', dietary: ['vegetarian'], preparationTime: '18 mins', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
    // Beverages (20-24)
  { name: 'Signature Cocktails', price: 15, description: 'House specialties crafted with premium spirits and fresh ingredients.', category: 'beverages', subcategory: 'Cocktail', ingredients: ['Premium Spirits','Fresh Citrus','Herbs','Syrups'], spiceLevel: 'mild', dietary: [], preparationTime: '5 mins', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Wine Selection', price: 12, description: 'Curated collection of fine wines from renowned vineyards around the world.', category: 'beverages', subcategory: 'Wine', ingredients: ['Red Wine','White Wine','Rosé','Champagne'], spiceLevel: 'mild', dietary: ['vegan'], preparationTime: '2 mins', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Artisan Coffee', price: 6, description: 'Single-origin coffee beans expertly roasted and brewed to perfection.', category: 'beverages', subcategory: 'Coffee', ingredients: ['Single-Origin Beans','Filtered Water'], spiceLevel: 'mild', dietary: ['vegan'], preparationTime: '3 mins', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Fresh Juices', price: 8, description: 'Freshly squeezed seasonal fruit and vegetable juices made to order.', category: 'beverages', subcategory: 'Non-Alcoholic', ingredients: ['Seasonal Fruits','Vegetables','Herbs'], spiceLevel: 'mild', dietary: ['vegan','gluten-free'], preparationTime: '4 mins', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' },
  { name: 'Premium Tea Selection', price: 7, description: 'Hand-picked teas from around the world, served with traditional accompaniments.', category: 'beverages', subcategory: 'Tea', ingredients: ['Premium Tea Leaves','Honey','Lemon','Milk'], spiceLevel: 'mild', dietary: ['vegetarian'], preparationTime: '5 mins', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80' }
  ];

  const inserted = await MenuItem.insertMany(fullMenu);
  console.log(`Seeded ${inserted.length} full menu items.`);
  await mongoose.disconnect();
}

run().catch(err => { console.error('Seed error:', err); process.exit(1); });
