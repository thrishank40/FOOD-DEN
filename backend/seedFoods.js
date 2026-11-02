const mongoose = require("mongoose");
require("dotenv").config();
const Food = require("./models/Food");
const Category = require("./models/Category");

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Food.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing foods and categories");

    // ── Create Categories ──────────────────────────────────────────
    const categoryData = [
      { name: "Pizza" },
      { name: "Burgers" },
      { name: "Fries & Sides" },
      { name: "Beverages" },
    ];

    const categories = await Category.insertMany(categoryData);
    const cat = {};
    categories.forEach((c) => { cat[c.name] = c._id; });

    // ── Seed Foods ─────────────────────────────────────────────────
    const foods = [

      // ══════════════════════════════
      // A. PIZZAS
      // ══════════════════════════════
      {
        name: "Margherita Pizza",
        description: "Classic thin-crust pizza topped with rich tomato sauce, fresh mozzarella and fragrant basil leaves.",
        price: 299,
        oldPrice: 399,
        discount: 25,
        isOffer: true,
        rating: 4.8,
        calories: 850,
        prepTime: "25 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Farmhouse Pizza",
        description: "Loaded with capsicum, mushrooms, onions, paneer and olives on a creamy tomato base.",
        price: 349,
        oldPrice: 449,
        discount: 22,
        isOffer: true,
        rating: 4.6,
        calories: 920,
        prepTime: "28 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Veggie Supreme Pizza",
        description: "Colourful medley of fresh vegetables, sweet corn, red paprika and mozzarella on a herb base.",
        price: 329,
        oldPrice: 429,
        discount: 23,
        isOffer: false,
        rating: 4.5,
        calories: 880,
        prepTime: "27 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Chicken Tikka Pizza",
        description: "Marinated chicken tikka chunks, capsicum and red onion on a spiced tikka masala sauce.",
        price: 399,
        oldPrice: 499,
        discount: 20,
        isOffer: true,
        rating: 4.9,
        calories: 1050,
        prepTime: "30 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "BBQ Chicken Pizza",
        description: "Tender BBQ glazed chicken, caramelised onions and tangy BBQ sauce with double cheese.",
        price: 419,
        oldPrice: 529,
        discount: 21,
        isOffer: false,
        rating: 4.7,
        calories: 1100,
        prepTime: "30 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Loaded Cheese Pizza",
        description: "Four-cheese heaven — mozzarella, cheddar, gouda and parmesan on a garlic cream sauce.",
        price: 379,
        oldPrice: 479,
        discount: 21,
        isOffer: true,
        rating: 4.8,
        calories: 1000,
        prepTime: "28 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1602024242516-fbc9d4fda4b6?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },

      // ══════════════════════════════
      // B. BURGERS
      // ══════════════════════════════
      {
        name: "Classic Veg Burger",
        description: "Crispy aloo tikki patty with lettuce, tomato, onion and our special mint chutney in a toasted sesame bun.",
        price: 149,
        oldPrice: 199,
        discount: 25,
        isOffer: false,
        rating: 4.3,
        calories: 420,
        prepTime: "15 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Crispy Chicken Burger",
        description: "Golden fried chicken fillet with coleslaw, pickles and zinger mayo in a soft brioche bun.",
        price: 199,
        oldPrice: 269,
        discount: 26,
        isOffer: true,
        rating: 4.6,
        calories: 620,
        prepTime: "18 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Loaded Cheese Chicken Burger",
        description: "Juicy chicken patty piled with three cheese slices, caramelised onions, jalapeños and smoky chipotle sauce.",
        price: 249,
        oldPrice: 329,
        discount: 24,
        isOffer: true,
        rating: 4.9,
        calories: 780,
        prepTime: "20 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Double Patty Burger",
        description: "Two smashed beef-style patties, American cheese, crispy bacon bits, lettuce and special sauce.",
        price: 299,
        oldPrice: 399,
        discount: 25,
        isOffer: false,
        rating: 4.8,
        calories: 950,
        prepTime: "22 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Spicy Chicken Burger",
        description: "Fiery Nashville-style hot chicken with spicy sauce, pickled slaw and habanero relish.",
        price: 219,
        oldPrice: 289,
        discount: 24,
        isOffer: true,
        rating: 4.7,
        calories: 660,
        prepTime: "18 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Peri Peri Burger",
        description: "Grilled chicken marinated in smoky peri peri sauce, topped with peri mayo and fresh lettuce.",
        price: 229,
        oldPrice: 299,
        discount: 23,
        isOffer: false,
        rating: 4.7,
        calories: 590,
        prepTime: "20 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },

      // ══════════════════════════════
      // C. FRIES & SIDES
      // ══════════════════════════════
      {
        name: "Classic French Fries",
        description: "Crispy golden fries seasoned with sea salt. Perfect for any meal.",
        price: 79,
        oldPrice: 99,
        discount: 20,
        isOffer: false,
        rating: 4.5,
        calories: 365,
        prepTime: "8 min",
        category: cat["Fries & Sides"],
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Peri Peri Fries",
        description: "Crispy fries tossed in tangy African peri peri spice blend with a hint of lime.",
        price: 99,
        oldPrice: 129,
        discount: 23,
        isOffer: true,
        rating: 4.7,
        calories: 395,
        prepTime: "10 min",
        category: cat["Fries & Sides"],
        image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Cheesy Fries",
        description: "Golden fries smothered with a warm cheddar cheese dip and a sprinkle of chives.",
        price: 119,
        oldPrice: 149,
        discount: 20,
        isOffer: true,
        rating: 4.8,
        calories: 480,
        prepTime: "10 min",
        category: cat["Fries & Sides"],
        image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Garlic Bread",
        description: "Toasted baguette brushed with herb garlic butter, topped with mozzarella and fresh parsley.",
        price: 89,
        oldPrice: 119,
        discount: 25,
        isOffer: false,
        rating: 4.4,
        calories: 310,
        prepTime: "10 min",
        category: cat["Fries & Sides"],
        image: "https://images.unsplash.com/photo-1619535860434-cf9b902a2eca?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Chicken Nuggets (6 pcs)",
        description: "Tender chicken nuggets with a crunchy golden coating. Served with dipping sauce.",
        price: 149,
        oldPrice: 199,
        discount: 25,
        isOffer: false,
        rating: 4.6,
        calories: 490,
        prepTime: "12 min",
        category: cat["Fries & Sides"],
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },

      // ══════════════════════════════
      // D. BEVERAGES
      // ══════════════════════════════
      {
        name: "Coca-Cola",
        description: "Ice cold Coca-Cola — the world's favourite fizzy drink. Served with ice.",
        price: 60,
        oldPrice: 80,
        discount: 25,
        isOffer: false,
        rating: 4.5,
        calories: 140,
        prepTime: "2 min",
        category: cat["Beverages"],
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Pepsi",
        description: "Refreshing Pepsi cola served chilled with ice and a slice of lemon.",
        price: 60,
        oldPrice: 80,
        discount: 25,
        isOffer: false,
        rating: 4.4,
        calories: 150,
        prepTime: "2 min",
        category: cat["Beverages"],
        image: "https://images.unsplash.com/photo-1629203432180-71b0e1581e42?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Sprite",
        description: "Crisp and clean lemon-lime flavour Sprite. The perfect thirst quencher.",
        price: 60,
        oldPrice: 80,
        discount: 25,
        isOffer: false,
        rating: 4.3,
        calories: 130,
        prepTime: "2 min",
        category: cat["Beverages"],
        image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Fresh Lime Soda",
        description: "Sparkling soda with freshly squeezed lime juice, a pinch of salt and black pepper.",
        price: 79,
        oldPrice: 99,
        discount: 20,
        isOffer: false,
        rating: 4.6,
        calories: 60,
        prepTime: "3 min",
        category: cat["Beverages"],
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Chocolate Milkshake",
        description: "Thick, indulgent chocolate milkshake blended with premium chocolate syrup and creamy milk.",
        price: 149,
        oldPrice: 199,
        discount: 25,
        isOffer: true,
        rating: 4.9,
        calories: 420,
        prepTime: "5 min",
        category: cat["Beverages"],
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
      {
        name: "Cold Coffee",
        description: "Chilled coffee blended with milk, sugar and ice cream. A refreshing pick-me-up.",
        price: 129,
        oldPrice: 169,
        discount: 24,
        isOffer: false,
        rating: 4.7,
        calories: 220,
        prepTime: "5 min",
        category: cat["Beverages"],
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&fit=crop",
        availability: true,
        isAvailable: true,
      },
    ];

    const nonVegNames = [
      "Chicken Tikka Pizza",
      "BBQ Chicken Pizza",
      "Crispy Chicken Burger",
      "Loaded Cheese Chicken Burger",
      "Double Patty Burger",
      "Spicy Chicken Burger",
      "Peri Peri Burger",
      "Chicken Nuggets"
    ];
    foods.forEach(f => {
      f.isVeg = !nonVegNames.includes(f.name);
    });

    await Food.insertMany(foods);

    console.log(`✅ Inserted ${foods.length} food items across ${categories.length} categories`);
    console.log("📋 Categories:");
    categories.forEach((c) => console.log(`   - ${c.name}`));
    console.log("🍽️  FoodDen menu is ready! Run your frontend to see the updated menu.");

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedFoods();