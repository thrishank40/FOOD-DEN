const mongoose = require("mongoose");
require("dotenv").config();

const Food = require("./models/Food");
const Category = require("./models/Category");

const originalItems = [
  // Desserts
  {
    name: "Triple Chocolate Cake",
    description: "Decadent three-layer rich chocolate cake with warm ganache frosting and delicate chocolate shavings.",
    price: 349,
    oldPrice: 449,
    discount: 22,
    isOffer: true,
    rating: 4.9,
    calories: 540,
    prepTime: "10 min",
    categoryName: "Desserts & Treats",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&fit=crop",
  },
  {
    name: "Strawberry Cheesecake",
    description: "Velvety New York style cream cheese filling on a buttery biscuit crust with fresh strawberry compote.",
    price: 329,
    oldPrice: 429,
    discount: 23,
    isOffer: false,
    rating: 4.9,
    calories: 480,
    prepTime: "10 min",
    categoryName: "Desserts & Treats",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&fit=crop",
  },

  // Pasta
  {
    name: "Creamy Mushroom Pasta",
    description: "Fettuccine tossed in a silky garlic cream sauce with sautéed wild button mushrooms, herbs and parmesan.",
    price: 389,
    oldPrice: 489,
    discount: 20,
    isOffer: true,
    rating: 4.6,
    calories: 780,
    prepTime: "25 min",
    categoryName: "Pasta",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&fit=crop",
  },

  // Sandwiches
  {
    name: "Classic Club Sandwich",
    description: "Triple-decker grilled sandwich packed with smoked chicken fillet, melted cheddar, lettuce, tomato, and herb mayo.",
    price: 269,
    oldPrice: 349,
    discount: 23,
    isOffer: false,
    rating: 4.4,
    calories: 610,
    prepTime: "15 min",
    categoryName: "Sandwiches & Wraps",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&fit=crop",
  },

  // Salads
  {
    name: "Fresh Garden Salad",
    description: "Crisp romaine hearts, cherry tomatoes, English cucumbers, bell peppers, Kalamata olives, and balsamic vinaigrette.",
    price: 249,
    oldPrice: 329,
    discount: 24,
    isOffer: false,
    rating: 4.2,
    calories: 320,
    prepTime: "10 min",
    categoryName: "Fresh Salads",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&fit=crop",
  },
  {
    name: "Caesar Salad",
    description: "Crispy lettuce tossed in creamy parmesan Caesar dressing topped with garlic herb croutons and shaved parmesan.",
    price: 279,
    oldPrice: 359,
    discount: 22,
    isOffer: false,
    rating: 4.5,
    calories: 410,
    prepTime: "10 min",
    categoryName: "Fresh Salads",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&fit=crop",
  },

  // Drinks / Shakes
  {
    name: "Alphonso Mango Shake",
    description: "Real Alphonso mango pulp blended with rich chilled milk and vanilla ice cream — thick and refreshing.",
    price: 159,
    oldPrice: 199,
    discount: 20,
    isOffer: true,
    rating: 4.8,
    calories: 310,
    prepTime: "5 min",
    categoryName: "Beverages",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&fit=crop",
  },

  // Gourmet Burgers
  {
    name: "Gourmet Veggie Burger",
    description: "Handcrafted spiced vegetable patty with avocado mash, fresh greens, pickled jalapeños and smoky chipotle sauce.",
    price: 229,
    oldPrice: 299,
    discount: 23,
    isOffer: false,
    rating: 4.4,
    calories: 520,
    prepTime: "18 min",
    categoryName: "Burgers",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&fit=crop",
  },
  {
    name: "Signature Chicken Burger",
    description: "Golden tender chicken breast fillet with melted cheese, lettuce, pickles, and our signature secret sauce on brioche.",
    price: 259,
    oldPrice: 329,
    discount: 21,
    isOffer: true,
    rating: 4.7,
    calories: 640,
    prepTime: "20 min",
    categoryName: "Burgers",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&fit=crop",
  },

  // Crispy & Fries
  {
    name: "Crispy Fried Chicken Tenders",
    description: "Extra-crispy Southern style fried chicken strips served with honey mustard and tangy garlic dip.",
    price: 269,
    oldPrice: 349,
    discount: 23,
    isOffer: true,
    rating: 4.7,
    calories: 720,
    prepTime: "18 min",
    categoryName: "Fries & Sides",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&fit=crop",
  },
];

async function restore() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
  console.log("✅ Connected to MongoDB:", mongoose.connection.name);

  // 1. Ensure all categories exist without deleting any
  const existingCategories = await Category.find({});
  const catMap = {};
  existingCategories.forEach((c) => {
    catMap[c.name] = c._id;
  });

  const categoriesNeeded = [
    "Pizza",
    "Burgers",
    "Fries & Sides",
    "Beverages",
    "Desserts & Treats",
    "Pasta",
    "Sandwiches & Wraps",
    "Fresh Salads",
  ];

  for (const catName of categoriesNeeded) {
    if (!catMap[catName]) {
      const newCat = await Category.create({ name: catName });
      catMap[catName] = newCat._id;
      console.log(`➕ Added missing category: ${catName}`);
    }
  }

  // 2. Insert missing original foods (DO NOT delete existing!)
  let addedCount = 0;
  for (const item of originalItems) {
    const exists = await Food.findOne({ name: item.name });
    if (!exists) {
      await Food.create({
        name: item.name,
        description: item.description,
        price: item.price,
        oldPrice: item.oldPrice,
        discount: item.discount,
        isOffer: item.isOffer,
        rating: item.rating,
        calories: item.calories,
        prepTime: item.prepTime,
        category: catMap[item.categoryName],
        isVeg: item.isVeg,
        image: item.image,
        isAvailable: true,
        availability: true,
      });
      console.log(`🍲 Restored food item: ${item.name} (${item.categoryName})`);
      addedCount++;
    } else {
      console.log(`✔️ Already present: ${item.name}`);
    }
  }

  const totalFoods = await Food.countDocuments();
  const totalCats = await Category.countDocuments();
  console.log(`\n🎉 Restoration complete!`);
  console.log(`Total Food Items in Database: ${totalFoods} (restored +${addedCount} original items)`);
  console.log(`Total Categories in Database: ${totalCats}`);

  await mongoose.disconnect();
}

restore().catch((err) => {
  console.error("Restoration error:", err);
  process.exit(1);
});

