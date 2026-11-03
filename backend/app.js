const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();


// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  // deployed frontend
  "https://delish-drop-restaurant-management-by-mushtaq.vercel.app",

  // deployed backend (optional)
  "https://delish-drop-restaurant-management-by-mushtaque.vercel.app",

  // localhost development
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:3000",

  // Vercel / Custom ENV
  process.env.CLIENT_URL,
].filter(Boolean);

const isOriginAllowed = (origin) => {
  // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Allow any localhost / 127.0.0.1 port during local development
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    console.warn("Blocked by CORS policy:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));


// ===============================
// MIDDLEWARES
// ===============================

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ===============================
// HEALTH CHECK (exempt from rate limit)
// ===============================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FoodDen API is running 🚀",
  });
});

// ===============================
// RATE LIMIT
// ===============================

const isDev = process.env.NODE_ENV !== "production";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use("/api", apiLimiter);


// ===============================
// API ROUTES
// ===============================


app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/foods",
  foodRoutes
);


app.use(
  "/api/categories",
  categoryRoutes
);


app.use(
  "/api/orders",
  orderRoutes
);


app.use(
  "/api/delivery",
  deliveryRoutes
);


app.use(
  "/api/admin",
  adminRoutes
);


app.use(
  "/api/favourites",
  favouriteRoutes
);


// ===============================
// 404 ROUTE
// ===============================

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message:
      `Route ${req.originalUrl} not found`,
  });

});


// ===============================
// ERROR HANDLER
// ===============================

app.use(errorHandler);


module.exports = app;