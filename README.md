# 🍲 FoodDen – Modern Food Ordering & Restaurant Management System

> A comprehensive, modern MERN-stack web application for online food ordering, menu customization, and complete restaurant administration.

---

## 📋 Project Overview

**FoodDen** is a full-featured MERN (MongoDB, Express, React, Node.js) web application designed for modern food delivery and restaurant operations. Customers can browse authentic multi-category food items (Pizzas, Burgers, Fries & Sides, Beverages), filter by dietary preferences (Pure Veg / Non-Veg), customize orders (sizes, crusts, patties, and add-ons), manage their persistent shopping cart, and place Cash on Delivery orders with live order tracking. Restaurant administrators have access to an admin dashboard featuring revenue analytics, order status progression, and full food item CRUD operations.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 19 (Vite)
  - React Router DOM (HashRouter for reliable single-page routing)
  - Tailwind CSS + Vanilla CSS Variables
  - Lucide & React Icons (`react-icons/fi`)
  - Context API (`AuthContext`, `CartContext`, `FavouriteContext`)
  - Axios HTTP Client
- **Backend**:
  - Node.js & Express.js REST API
  - MongoDB & Mongoose ODM
  - JSON Web Tokens (JWT) & bcryptjs for password hashing
  - Express Validator & CORS
- **Database**:
  - MongoDB Atlas / Local MongoDB

---

## ✨ Features

### 👤 Customer Experience
1. **Secure Authentication**:
   - Registration with full name, email, phone number, delivery address, and bcrypt hashed password.
   - Login with JWT token generation and persistent authentication state.
2. **Interactive Food Menu**:
   - 23 seeded realistic dishes across 4 primary categories:
     - **Pizzas**: Margherita, Farmhouse, Veggie Supreme, Chicken Tikka, BBQ Chicken, Loaded Cheese.
     - **Burgers**: Classic Veg, Crispy Chicken, Loaded Cheese Chicken, Double Patty, Spicy Chicken, Peri Peri.
     - **Fries & Sides**: Classic French Fries, Peri Peri Fries, Cheesy Fries, Garlic Bread, Chicken Nuggets.
     - **Beverages**: Coca-Cola, Pepsi, Sprite, Fresh Lime Soda, Chocolate Milkshake, Cold Coffee.
3. **Advanced Filtering & Search**:
   - Live search by food name, ingredients, and category.
   - Category navigation tabs.
   - Dietary filter chips: **All**, **🟢 Pure Veg**, and **🔴 Non-Veg**.
   - Price & rating sorting (Price: Low to High, Price: High to Low, Top Rated).
4. **Food Customization**:
   - Interactive customization modal:
     - **Crust / Size / Patty selection**: Small, Medium (+₹60), Large (+₹120) for pizzas; Single vs Double Patty (+₹70) for burgers.
     - **Add-ons & Extras**: Extra Mozzarella (+₹45), Jalapenos (+₹35), Cheese Slice (+₹25), Peri Peri Seasoning (+₹20), Cheese Dip (+₹30).
     - Dynamic live price calculation in Indian Rupees (₹).
5. **Cart & Cash on Delivery Checkout**:
   - Persistent cart in `localStorage` preserving custom item choices.
   - Quantity increment/decrement and item removal.
   - Order summary with subtotal, tax calculation, and Cash on Delivery payment option.
6. **Order Confirmation & Customer Dashboard**:
   - Instant order confirmation screen with order summary and estimated delivery time.
   - Customer account dashboard with order history, customization details, and status tracking (Placed, Accepted, Preparing, Ready, Delivered, Cancelled).
   - Saved favourite dishes list.

### 🛡️ Restaurant Admin Panel
1. **Analytics & Statistics**:
   - Total customers, total orders, today's orders, and available foods.
   - Revenue analytics: Total Revenue, Today's Revenue, Weekly Revenue, Monthly Revenue in ₹.
2. **Order Management**:
   - Real-time list of customer orders with delivery addresses, ordered items, and customizations.
   - Status progression buttons: `Placed` → `Accepted` → `Preparing` → `Ready` → `Picked` → `Delivered` (or `Cancelled`).
3. **Food Inventory Management**:
   - Add new food items with name, price, old price, discount, image URL, category, dietary badge (Pure Veg / Non-Veg), and prep time.
   - Edit existing dishes and toggle availability (Enable / Disable).
   - Promote items to Special Offers section.
   - Safe item deletion.

---

## 📁 Project Structure

```
FoodDen/
├── backend/
│   ├── config/             # Database connection (db.js)
│   ├── controllers/        # Express route controllers (auth, food, order, admin)
│   ├── middleware/         # Auth & error handling middleware
│   ├── models/             # Mongoose schemas (User, Food, Order, Category)
│   ├── routes/             # REST API routes (authRoutes, foodRoutes, orderRoutes, adminRoutes)
│   ├── app.js              # Express app setup & route mounting
│   ├── server.js           # Server entry point & HTTP listener
│   ├── seedFoods.js        # Seed script for 23 realistic food items & categories
│   ├── seedAdmin.js        # Seed script for default admin account
│   ├── test_e2e.js         # Automated end-to-end integration test suite
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, Hero, PromoSection, TopPicks, CustomizeModal
│   │   ├── context/        # AuthContext, CartContext, FavouriteContext
│   │   ├── pages/          # Home, Menu, FoodDetails, Cart, OrderConfirmation, Login, Signup, Dashboard, AdminDashboard
│   │   ├── routes/         # AppRoutes, ProtectedRoute (PrivateRoute, AdminRoute)
│   │   ├── services/       # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance (MongoDB Atlas connection string or local MongoDB running at `mongodb://localhost:27017/foodden`)

---

### 1. Backend Setup

1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create or verify `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/foodden?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```
4. Seed the database with food items and admin account:
   ```bash
   # Initialize administrator
   node seedAdmin.js

   # Populate 23 food items across 4 categories
   node seedFoods.js
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:5000/api`.

---

### 2. Frontend Setup

1. Open a second terminal in the `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create or verify `Frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The web application will open at `http://localhost:5173`.

---

## 🔑 Default Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@foodden.com` | `Admin@123456` | Admin Dashboard, Order Management, Food Inventory |
| **Customer (Demo)** | `rohan@example.com` | `Password@123` | Menu Browsing, Customization, Cart, Checkout, Dashboard |

*(New customer accounts can also be created anytime from the **Sign Up** page).*

---

## 🧪 Automated Testing

The project includes an end-to-end integration test suite verifying all core user and admin flows:

Run from the `backend` directory:
```bash
node test_e2e.js
```

**Tested Workflows:**
1. ✅ Health check endpoint verification
2. ✅ Customer registration with password hashing
3. ✅ Customer authentication & JWT generation
4. ✅ Menu retrieval & category filtering
5. ✅ Food customization & Cash on Delivery order creation
6. ✅ Customer order history retrieval
7. ✅ Admin authentication & authorization guard
8. ✅ Admin order queue inspection
9. ✅ Admin order status progression (`placed` → `delivered`)
10. ✅ Revenue & sales analytics calculation

---

## 📄 License
This project is for educational and evaluation purposes.
